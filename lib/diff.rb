require 'pathname'
require 'ostruct'

class Diff
  MODIFIERS = ['IGNORE']
  KEYWORDS = ['BEFORE', 'AFTER', 'OVERWRITE', 'REPLACE', 'BLOCK_REPLACE', 'ENSURE_NO', 'ENSURE_EXIST']

  attr_reader :changes

  def self.parse(path)
    new(path).parse!
  end

  def self.root_path=(path)
    @root_path = Pathname.new(path)
  end

  def self.root_path
    @root_path
  end

  def relative_path
    @template_path ||= Pathname.new(@path).relative_path_from(self.class.root_path).sub(/\.diff\z/, '')
  end

  def parse!
    tap do
      change = nil
      reset_buffers!

      puts "Parsing: #{relative_path}"

      data = File.open(@path)
      data.readlines.each do |line|
        token = line.rstrip
        next if @direction == :match && token.length == 0

        if (keyword = KEYWORDS.detect { |kw| token.start_with?(kw) })
          reset_buffers!
          set_direction(:match)

          change = OpenStruct.new(
            type: keyword,
            modifiers: token.split('_').select { |mod| MODIFIERS.include?(mod) },
            path: relative_path,
            matches: []
          )
        elsif token == 'WITH'
          set_direction(:replace)
        elsif token == 'OR'
          change.matches << @match_buffer.dup
          reset_buffers!
        elsif token == 'END'
          change.matches << @match_buffer[0...-1].dup
          change.replace = @replace_buffer[0...-1].dup

          @changes << change

          reset_buffers!
        else
          append_buffer(line)
        end
      end

      raise "There's no changes in '#{relative_path}'" if @changes.size == 0
    end
  end

  private

  def append_buffer(data)
    case @direction
    when :match
      @match_buffer << data
    when :replace
      @replace_buffer << data
    else
      raise NotImplementedError
    end
  end

  def set_direction(direction)
    @direction = direction
  end

  def reset_buffers!
    @direction = :match
    @replace_buffer = ''
    @match_buffer = ''
  end

  def initialize(path)
    @path = path
    @changes = []
  end
end
