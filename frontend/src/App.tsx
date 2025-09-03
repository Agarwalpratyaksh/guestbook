import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Guestbook } from './components/Guestbook';
import './App.css';

function App() {
  const { connected } = useWallet();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana Guestbook 📖</h1>
        <WalletMultiButton />
      </header>
      <main>
        {connected ? (
          <Guestbook />
        ) : (
          <p>Please connect your wallet to use the guestbook.</p>
        )}
      </main>
    </div>
  );
}

export default App;