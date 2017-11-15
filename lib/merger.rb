require_relative 'match_replace'

class Merger
  def initialize(theme_root)
    @theme_root = Pathname.new(theme_root)
    @files = []

    search_path = File.join(@theme_root, '**', '*')
    Dir.glob(search_path).each do |path|
      @files << {
        full_path: path,
        relative_path: Pathname.new(path).relative_path_from(@theme_root)
      }
    end
  end

  def merge!(diff)
    file = @files.detect { |f| f[:relative_path] == diff.relative_path }
    content = file ? File.read(file[:full_path]) : ''

    MatchReplace.new(diff.relative_path, content).tap do |matcher|
      diff.changes.each { |change| matcher.match_replace!(change) }
    end
  end
end
