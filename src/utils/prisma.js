import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

export function highlightCode(code, language) {
  if (typeof window === 'undefined') {
    return code; // Return unformatted code on server-side
  }

  try {
    // Ensure the language exists in Prism
    const lang = Prism.languages[language] || Prism.languages.javascript;
    return Prism.highlight(code, lang, language);
  } catch (error) {
    console.error('Prism highlighting error:', error);
    return code;
  }
}