#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'
require 'digest'

Bundler.require

require_relative 'lib/diff_parser'
require_relative 'lib/merger'

themes_root = File.join(ARGV[0], "*/*/*/")
diffs_root = File.expand_path('../diffs', __FILE__)

parser = DiffParser.parse(diffs_root)

Dir.glob(themes_root).each do |theme_root|
  next unless File.directory?(theme_root)
  next unless theme_root.include?('/136/234')

  merger = Merger.new(theme_root)
  parser.each do |diff|
    merge = merger.merge!(diff)

    if merge.conflicts.empty?
      # file_path = File.join(theme_root, merge.path)
      # file = File.open(file_path, 'w+')
      # file.write(merge.result)
      # file.close
    else
      puts "Conflicts Found For: #{theme_root}"

      file = File.open(File.join(theme_root, '..', 'conflicts.log'), 'a+')
      merge.conflicts.each do |type, details|
        file.write("#{type}:\n")
        details.each do |d|
          file.write("#{d[:change].path}: #{d[:message]}\n")
          file.write("-------------------------------------------------\n")
        end
        file.write("-------------------------------------------------\n")
      end
      file.close
    end
  end
end
