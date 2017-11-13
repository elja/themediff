#!/usr/bin/env ruby

require_relative 'lib/diff_parser'
require_relative 'lib/scanner'
require_relative 'lib/merger'

theme_path = ARGV[0]
diffs_path = File.expand_path('../diffs', __FILE__)

parser = DiffParser.parse(diffs_path)
merger = Merger.new(theme_path)

parser.each do |diff|
  if merger.merge!(diff)
    puts "Diff: #{diff.relative_path} was merged!"
  else
    puts merger.conflicts
  end
end
