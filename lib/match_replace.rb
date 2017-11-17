class MatchReplace
  class MatchError < StandardError
    attr_reader :change, :result

    def initialize(msg, result, change)
      @change = change
      @result = result
      super(msg)
    end
  end

  class MatchFound < MatchError;
  end
  class MatchNotFound < MatchError;
  end
  class BlockNotFound < MatchError;
  end

  BLOCK_ANY = /\bANY\b/
  REGEXP_PART = /\#{([^\}]+)\}/

  attr_reader :conflicts, :path, :result

  def initialize(path, file)
    @path = path
    @file = file
    @content = @file ? File.read(file[:full_path]) : ''
    @result = @content.dup

    @conflicts = Hash.new { |h, k| h[k] = [] }
  end

  def match_replace!(change)
    case change.type
    when 'BEFORE'
      adjust(change, :before)
    when 'AFTER'
      adjust(change, :after)
    when 'OVERWRITE'
      return (@result = change.matches[0])
    when 'REPLACE'
      replace_text(change)
    when 'BLOCK_REPLACE'
      block_replace(change)
    when 'ENSURE_NO'
      ensure_content(change, :absent)
    when 'ENSURE_EXIST'
      ensure_content(change, :present)
    end
  rescue MatchNotFound => ex
    conflicts[:not_found] << { change: ex.change, message: ex.message }
    return false
  rescue BlockNotFound => ex
    conflicts[:block_not_found] << { change: ex.change, message: ex.message }
    return false
  rescue MatchFound => ex
    conflicts[:match_found] << { change: ex.change, message: ex.message }
    return false
  end

  private

  def adjust(change, type)
    return false unless @file

    any_matched = false
    change.matches.each do |match|
      text_regexp = to_regexp(match)
      match_data = @result.to_enum(:scan, text_regexp).map { Regexp.last_match }

      if match_data.any?
        any_matched = true
        replace_content(match_data, change.replace, type: type)
      end
    end

    if !any_matched && !change.modifiers.include?('IGNORE')
      raise MatchNotFound.new("Match not found in path: #{@file[:full_path]}:\n#{change.matches.join("\n")}", @result, change)
    end

    @result
  end

  def ensure_content(change, type)
    change.matches.each do |match|
      text_regexp = to_regexp(match)
      match_data = text_regexp.match(@result)

      if !match_data.nil? && type == :absent
        raise MatchNotFound.new("Match (#{match_data}): \n#{change.matches.join("\n")} found in path (#{@file[:full_path]})", @result, change)
      end

      if !match_data && type == :present
        raise MatchNotFound.new("Match (#{match_data}): \n#{change.matches.join("\n")} not found in path (#{@file[:full_path]})", @result, change)
      end
    end

    @result
  end

  def replace_text(change)
    return false unless @file

    any_matched = false
    change.matches.each do |match|
      text_regexp = to_regexp(match)
      match_data = @result.to_enum(:scan, text_regexp).map { Regexp.last_match }

      if match_data.any?
        any_matched = true
        replace_content(match_data, change.replace)
      end
    end

    if !any_matched && !change.modifiers.include?('IGNORE')
      raise MatchNotFound.new("Match not found in path: #{@file[:full_path]}:\n#{change.matches.join("\n")}", @result, change)
    end

    @result
  end

  def block_replace(change)
    return false unless @file

    any_matched = false
    change.matches.each do |match|
      block_match = match
      start_match, end_match = block_match.split(BLOCK_ANY)

      start_match.strip!
      end_match.strip!

      block_regexps = if start_match.start_with?(Liquid::BlockBody::TAGSTART) && start_match =~ Liquid::BlockBody::FullToken
        to_liquid_regexps($1, start_match, end_match)
      elsif start_match =~ /<(\w+)[^>]*>/ # html node
        to_html_regexps($1, start_match, end_match)
      else
        raise NotImplementedError, "can't match block type for #{start_match}"
      end

      if block_regexps.size > 0
        block_regexps.each do |regexp|
          match_data = @result.to_enum(:scan, regexp).map { Regexp.last_match }

          if match_data.any?
            any_matched = true
            replace_content(match_data, change.replace)
          end
        end
      else
        unless change.modifiers.include?('IGNORE')
          raise BlockNotFound.new("Block '#{match.strip}' not found in path: #{@file[:full_path]}:\n#{change.matches.join("\n")}", @result, change)
        end
      end
    end

    if !any_matched && !change.modifiers.include?('IGNORE')
      raise BlockNotFound.new("Block '#{change.matches.join("\n")}' not found in path: #{@file[:full_path]}:\n#{change.matches.join("\n")}", @result, change)
    end

    @result
  end

  def replace_content(match_data, replace_with, type: nil)
    content_parts = []

    start_index = 0
    match_data.each do |match|
      begin_index, end_index = match.offset(0)
      content_parts << @result[start_index...begin_index]
      content_parts << if type == :before
                         "#{replace_with}#{@result[begin_index...end_index]}"
                       elsif type == :after
                         "#{@result[begin_index...end_index]}#{replace_with}"
                       else
                         replace_with
                       end

      start_index = end_index
    end

    content_parts << @result[start_index..-1]
    @result = content_parts.join
  end

  def to_block_regexps(tag_regexp, start_regexp, end_regexp)
    segments = @result.split(/(#{tag_regexp})/)
    matches = []

    match_data = ''
    opened_blocks = nil

    while segment = segments.shift
      tokens = segment.split(/(#{end_regexp})/)
      tokens.each do |token|
        if token =~ start_regexp
          opened_blocks ||= 0
          opened_blocks += 1

          match_data << token
        elsif token =~ end_regexp && (opened_blocks && opened_blocks > 0)
          opened_blocks -= 1
          match_data << token
        elsif token =~ tag_regexp && (opened_blocks && opened_blocks > 0)
          opened_blocks += 1
          match_data << token
        elsif opened_blocks && opened_blocks > 0
          match_data << token
        end

        if (opened_blocks && opened_blocks == 0) && match_data.length > 0
          matches << match_data.dup

          match_data = ''
          opened_blocks = nil
        end
      end
    end

    matches.map { |m| to_regexp(m) }
  end

  def to_html_regexps(tag_name, start_match, end_match)
    tag_regexp = Regexp.new("<#{tag_name}[^>_]*>")
    start_regexp = to_regexp(start_match)
    end_regexp = to_regexp(end_match)

    to_block_regexps(tag_regexp, start_regexp, end_regexp)
  end

  def to_liquid_regexps(tag_name, start_match, end_match)
    tag_regexp = Regexp.new("\\{%\s*#{tag_name}(?=\s|%})[^%}]*\s*%\\}")
    start_regexp = to_regexp(start_match)
    end_regexp = to_regexp(end_match)

    to_block_regexps(tag_regexp, start_regexp, end_regexp)
  end

  def to_regexp(match_str)
    parts = match_str.split(REGEXP_PART)
    regexps = match_str.scan(REGEXP_PART).flatten
    regexp_str = parts.each_with_object('') do |part, memo|
      if regexps.include?(part)
        memo << part
      else
        sub_parts = part.split(/\s+/)
        sub_parts.each do |sub_part|
          memo << Regexp.quote(sub_part)
          memo << '\s*' if sub_parts.size > 1
        end
      end
    end

    Regexp.new regexp_str.sub(/\\s\*$/, '')
  end
end
