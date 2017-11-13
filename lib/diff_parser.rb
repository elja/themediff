require_relative 'diff'

class DiffParser
  def self.parse(diffs_path)
    new(diffs_path).parse!
  end

  def each(&block)
    @diffs.each do |diff|
      block.call(diff)
    end
  end

  def parse!
    Diff.root_path = @base_path

    tap do
      @diffs = @files.map do |path|
        Diff.parse(path)
      end
    end
  end

  private

  def initialize(path)
    @base_path = path
    @files = Dir[File.join(path, "**", "*.diff")]
  end
end
