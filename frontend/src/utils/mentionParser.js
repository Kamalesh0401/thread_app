export const parseMentions = (content) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    
    return [...new Set(mentions)];
  };
  
  export const formatWithMentions = (content) => {
    return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
  };
  
  export const renderWithMentions = (content) => {
    if (!content) return '';
    
    const parts = [];
    const mentionRegex = /@(\w+)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      const username = match[1];
      parts.push(
        `<a href="/profile/${username}" class="mention">@${username}</a>`
      );
  
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return parts.join('');
  };