import DocumentMeta from 'react-document-meta';
import Page from './Page';

function App(){
  const meta = {
    title: 'Janken S | BN Games ~ 学習用Reactアプリ',
    description: '同じ合言葉の相手と対戦できます。合言葉とじゃんけんを入力した後、「Submit!」ボタンを押して自分のじゃんけんを確定できます。',
  };
  return (
    <DocumentMeta {...meta}>
        <Page />
    </DocumentMeta>
  )
}
export default App