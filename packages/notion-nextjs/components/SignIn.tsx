import * as React from 'react'
import { PageHead } from './PageHead'
import styles from './styles.module.css'

export const SignIn: React.FC = () => {
  return (
    <>
      <PageHead title={'Sign In'}/>

      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Sign In</h1>
        </main>
      </div>
    </>
  )
}
