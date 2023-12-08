import DocumentMeta from 'react-document-meta';
import Page from './Page';
import imageUri from './../assets/scissors.png'

function App(){
  const meta = {
    title: 'Janken S | BN Games ~ 学習用Reactアプリ',
    description: '同じ合言葉の相手と対戦できます。合言葉とじゃんけんを入力した後、「Submit!」ボタンを押して自分のじゃんけんを確定できます。',
    meta: {
      property: {
        'og:title': 'Janken S | BN Games ~ 学習用Reactアプリ',
        'og:url': 'https://bn-games-2403f.web.app/janken-s',
        'og:image': imageUri,
        'og:description': '同じ合言葉の相手と対戦できます。合言葉とじゃんけんを入力した後、「Submit!」ボタンを押して自分のじゃんけんを確定できます。',

        'twitter:card': 'summary_large_image',
        'twitter:title': 'Janken S | BN Games ~ 学習用Reactアプリ',
        'twitter:description': '同じ合言葉の相手と対戦できます。合言葉とじゃんけんを入力した後、「Submit!」ボタンを押して自分のじゃんけんを確定できます。',
        'twitter:image': imageUri
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