import { NextPage } from 'next'

const SignInPage: NextPage = () => {
  return (
    <div
      className='App'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        maxWidth: '100%'
      }}
    >
      <h1>Membership required to access</h1>
    </div>
  )
}

const styles = {}

export default SignInPage
