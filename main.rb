#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'

Bundler.require

require_relative 'lib/diff_parser'
require_relative 'lib/merger'

theme_root = File.expand_path('../themes/Minimal', __FILE__)
diffs_root = File.expand_path('../diffs', __FILE__)

parser = DiffParser.parse(diffs_root)
merger = Merger.new(theme_root)

parser.each do |diff|
  merge = merger.merge!(diff)

  if merge.conflicts.empty?
    file_path = File.join(theme_root, merge.path)
    file = File.open(file_path, 'w+')
    file.write(merge.result)
    file.close

    puts "Diff: #{diff.relative_path} was merged!"
  else
    puts merge.conflicts
  end
end
