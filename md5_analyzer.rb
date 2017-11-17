#!/usr/bin/env ruby

require 'pathname'
require 'digest'

COLLECT_MD5 = [
  # 'templates/cart.liquid',
  # 'snippets/product_option_attributes.liquid',
  # 'snippets/product_option_group_attributes.liquid',
  # 'templates/product.liquid',
  # 'templates/product.liquid',
  # 'snippets/line_item_fields.liquid',
  # 'snippets/line_item_product_options.liquid',
  # 'snippets/product_option.liquid',
  # 'snippets/product_option_attributes.liquid',
  # 'snippets/product_option_group_attributes.liquid',
  'snippets/address_fields.liquid',
  'snippets/contact_fields.liquid',
]

def get_md5(path)
  content = File.read(path)
  content.gsub!(/\s+/, '').gsub!(/\n|\r|\s|\t/, '')

  Digest::MD5.hexdigest(content)
end

themes_root = File.expand_path('../themes/*/*/', __FILE__)
md5_result = {}

Dir.glob(themes_root).each do |theme_root|
  theme_root = Pathname.new(theme_root)
  search_path = File.join(theme_root, '**', '*.liquid')

  Dir.glob(search_path).each do |path|
    relative_path = Pathname.new(path).relative_path_from(theme_root)

    if COLLECT_MD5.include?(relative_path.to_s)
      md5_result[relative_path.to_s] ||= {}
      md5_result[relative_path.to_s][get_md5(path)] ||= []
      md5_result[relative_path.to_s][get_md5(path)] << theme_root.to_s
    end
  end
end

puts md5_result
