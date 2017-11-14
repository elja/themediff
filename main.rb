#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'

Bundler.require

require_relative 'lib/diff_parser'
require_relative 'lib/merger'

Liquid::Template.register_tag('form_block', Liquid::Block)
Liquid::Template.register_tag('form_field', Liquid::Tag)
Liquid::Template.register_tag('country_state_select', Liquid::Tag)

theme_path = File.expand_path('../themes/Minimal', __FILE__)
diffs_path = File.expand_path('../diffs', __FILE__)

parser = DiffParser.parse(diffs_path)
merger = Merger.new(theme_path)

parser.each do |diff|
  merge = merger.merge!(diff)

  if merge.conflicts.empty?
    puts "Diff: #{diff.relative_path} was merged!"
  else
    puts merge.conflicts
  end
end
