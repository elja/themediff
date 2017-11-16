require 'pathname'
require 'ostruct'

class Diff
  KEYWORDS = ['OVERWRITE', 'REPLACE', 'REPLACE_ANY', 'REPLACE_BLOCK', 'REPLACE_OR_IGNORE', 'ENSURE_NO']

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
            matches: [],
            replace: ''
          )
        elsif token == 'WITH'
          match = false
        elsif token == 'OR'
          change.matches << change.match
          change.match = ''
        elsif token == 'END'
          change.matches << change.match
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
