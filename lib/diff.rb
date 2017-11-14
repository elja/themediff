require 'pathname'
require 'ostruct'

class Diff
  STOP_WORD = 'END'
  CONTENT_STOP = 'WITH'
  KEYWORDS = ['OVERWRITE', 'REPLACE', 'REPLACE_BLOCK', 'REPLACE_OR_IGNORE']

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
      match = true

      puts "Parsing: #{relative_path}"

      data = File.open(@path)
      data.readlines.each do |line|
        token = line.rstrip
        next if token.length == 0

        if KEYWORDS.include?(token)
          match = true
          change = OpenStruct.new(
            type: token,
            path: relative_path,
            match: '',
            replace: ''
          )
        elsif token == 'WITH'
          match = false
        elsif token == STOP_WORD
          @changes << change
        else
          match ? change.match << line : change.replace << line
        end
      end

      raise "There's no changes in '#{relative_path}'" if @changes.size == 0
    end
  end

  private

  def initialize(path)
    @path = path
    @changes = []
  end
end
