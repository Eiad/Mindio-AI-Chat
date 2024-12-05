import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

export function highlightCode(code, language) {
  if (typeof window === 'undefined') {
    return code;
  }

  try {
    // Map common file extensions to languages
    const languageMap = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'sh': 'bash',
      'bash': 'bash',
      'scss': 'scss',
      'css': 'css',
      'json': 'json',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c'
    };

    const mappedLanguage = languageMap[language] || language;
    const lang = Prism.languages[mappedLanguage] || Prism.languages.javascript;
    return Prism.highlight(code, lang, mappedLanguage);
  } catch (error) {
    console.error('Prism highlighting error:', error);
    return code;
  }
}