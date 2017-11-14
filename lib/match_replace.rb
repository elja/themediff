class MatchReplace
  class MatchNotFound < StandardError
    attr_reader :change

    def initialize(msg, change)
      @change = change
      super(msg)
    end
  end

  class BlockNotFound < MatchNotFound; end

  BLOCK_ANY = /\bANY\b/
  REGEXP_PART = /\#{([^\}]+)\}/

  attr_reader :conflicts, :result

  def initialize(content)
    @content = content
    @result = @content.dup

    @conflicts = Hash.new { |h, k| h[k] = [] }
  end

  def match_replace!(change)
    case change.type
    when 'OVERWRITE'
      return change.replace
    when 'REPLACE'
      replace_text(change)
    when 'REPLACE_OR_IGNORE'
      replace_text(change, strict: false)
    when 'REPLACE_BLOCK'
      replace_block(change)
    end
  rescue MatchNotFound => ex
    puts ex.message
    conflicts[:not_found] << ex.change

    return false
  end

  private

  def replace_text(change, strict: true)
    text_regexp = to_regexp(change.match)
    match_data = text_regexp.match(@content)

    if strict && match_data.nil?
      raise MatchNotFound.new("Can't find '#{change.match.strip}' in #{change.path}", change)
    end

    replace_content(match_data, change.replace)
  end

  def replace_block(change)
    block_match = change.match
    start_match, end_match = block_match.split(BLOCK_ANY)

    start_match.strip!
    end_match.strip!

    if start_match.start_with?(Liquid::BlockBody::TAGSTART) && start_match =~ Liquid::BlockBody::FullToken # liquid block
      block_regexps = to_liquid_regexps($1, start_match, end_match)

      if block_regexps.size == 0
        raise BlockNotFound.new("Can't find block '#{change.match.strip}' in #{change.path}", change)
      end

      block_regexps.each do |regexp|
        match_data = regexp.match(@content)

        if match_data.nil?
          raise MatchNotFound.new("Can't find '#{change.match.strip}' in #{change.path}", change)
        end

        replace_content(match_data, change.replace)
      end
    elsif start_match =~ /<(\w+)[^>]*>/  # html node
      block_regexps = to_html_regexps($1, start_match, end_match)

      if block_regexps.size == 0
        raise BlockNotFound.new("Can't find block '#{change.match.strip}' in #{change.path}", change)
      end

      block_regexps.each do |regexp|
        match_data = regexp.match(@content)

        if match_data.nil?
          raise MatchNotFound.new("Can't find '#{change.match.strip}' in #{change.path}", change)
        end

        replace_content(match_data, change.replace)
      end
    else
      raise NotImplementedError, "can't match block type for #{start_match}"
    end
  end

  def replace_content(match_data, replace_with)
    matched_fragments = match_data.to_a
    matched_fragments.each do |fragment|
      @result.gsub!(fragment, replace_with)
    end

    @result
  end

  def to_block_regexps(tag_regexp, start_regexp, end_regexp)
    segments = @content.split(/(#{tag_regexp})/)
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
    tag_regexp = Regexp.new("<#{tag_name}[^>]*>")
    start_regexp = to_regexp(start_match)
    end_regexp = to_regexp(end_match)

    to_block_regexps(tag_regexp, start_regexp, end_regexp)
  end

  def to_liquid_regexps(tag_name, start_match, end_match)
    tag_regexp = Regexp.new("\\{%\s*#{tag_name}[^_]*%\\}")
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
        parts = part.split(/\s+/)
        parts.each_with_index do |part, index|
          memo << Regexp.quote(part)
          memo << '\s*' if index < parts.size
        end
      end
    end

    Regexp.new(regexp_str)
  end
end
