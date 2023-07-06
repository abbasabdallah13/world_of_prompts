import Navbar from '@components/Navbar';
import Provider from '@components/Provider';
import '@styles/globals.css';

export const metaData = {
    title: 'World Of Prompts',
    description: 'Discover and Share Prompts'
}

const Root = ({children}) => {

  return (
    <html>
        <body>
            <Provider>
                <div className='main'>
                    <div className='gradient' />
                </div>
                <main className='app'>
                    <Navbar />
                    {children}
                </main>
            </Provider>
        </body>
    </html>
  )
};

export default Root;
