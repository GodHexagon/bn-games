import DocumentMeta from 'react-document-meta';
import Page from './Page';

function App(){
  const meta = {
    title: 'Janken Original | BN Games ~ 学習用Reactアプリ',
    description: '',
    meta: {
      property: {
        'og:title': 'Janken Original | BN Games ~ 学習用Reactアプリ',
        'og:url': 'https://bn-games-2403f.web.app/janken',
        'og:image': 'https://bn-games-2403f.web.app/assets/scissors-SHJFQtfI.png',
        'og:description': '',
      }
    }
  };
  return (
    <DocumentMeta {...meta}>
        <Page />
    </DocumentMeta>
  )
}
export default App