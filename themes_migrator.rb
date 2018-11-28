#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'
require 'digest'

Bundler.require

require_relative 'lib/diff_parser'
require_relative 'lib/merger'

themes_root = File.join(ARGV[0], "*/*/*")
diffs_root = File.expand_path('../diffs', __FILE__)

parser = DiffParser.parse(diffs_root)

Dir.glob(themes_root).each do |theme_root|
  next unless File.directory?(theme_root)

  # clean up previous conflicts
  conflicts = File.join(theme_root, '..', 'conflicts.log')
  FileUtils.rm(conflicts)

  merger = Merger.new(theme_root)
  parser.each do |diff|
    merge = merger.merge!(diff)

    if merge.conflicts.empty?
      next if ENV['DRY_RUN']

      file_path = File.join(theme_root, merge.path)
      file = File.open(file_path, 'w+')
      file.write(merge.result)
      file.close
    else
      puts "Conflicts Found For: #{theme_root}"

      unless ENV['DRY_RUN']
        file_path = File.join(theme_root, merge.path)
        file = File.open("#{file_path}.diff", 'w+')
        file.write(merge.result)
        file.close
      end

      file = File.open(File.join(theme_root, '..', 'conflicts.log'), 'a+')
      merge.conflicts.each do |type, details|
        file.write("#{type}:\n")
        details.each do |d|
          file.write("path: #{d[:change].path}, hash: #{d[:hash]}, message: #{d[:message]}\n")
          file.write("-------------------------------------------------\n")
        end
        file.write("-------------------------------------------------\n")
      end
      file.close
    end
  end
end
