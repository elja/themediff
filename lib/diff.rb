require 'pathname'

class Diff
  STOP_WORD = 'END'
  CONTENT_STOP = 'WITH'
  KEYWORDS = ['OVERWRITE', 'REPLACE', 'REPLACE_BLOCK', 'REPLACE_OR_IGNORE']

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
    @template_path ||= Pathname.new(@path).relative_path_from(self.class.root_path)
  end

  def parse!
    tap do
      change = nil
      match = true

      puts "Parsing: #{relative_path}"

      data = File.read(@path)
      data.each_line do |line|
        line = line.strip
        next if line.length == 0

        if KEYWORDS.include?(line.strip)
          match = true
          change = { type: line, match: '', replace: '' }
        elsif line == 'WITH'
          match = false
        elsif line == STOP_WORD
          @changes << change
        else
          match ? change[:match] << line : change[:replace] << line
        end
      end
    end
  end

  private

  def initialize(path)
    @path = path
    @changes = []
  end
end
