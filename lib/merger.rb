class Merger


  def initialize(theme_root)
    @theme_root = Pathname.new(theme_root)
    @files = []
    @conflicts = []

    Dir[File.join(@theme_root, '**', '*')].each do |path|
      @files << {
        full_path: path,
        relative_path: Pathname.new(path).relative_path_from(@theme_root)
      }
    end
  end

  def merge!(diff)
    file = @files.detect { |f| f[:relative_path] == diff.relative_path }

    unless file
      @conflicts << "File: #{diff.relative_path} no found!"
      return false
    end

    content = File.read(file[:full_path])

    diff.changes.each do |change|
      case change.type
      when 'OVERWRITE'
      when 'REPLACE_BLOCK'
      when 'REPLACE_OR_IGNORE'
      when 'REPLACE'
      end
    end
  end
end
