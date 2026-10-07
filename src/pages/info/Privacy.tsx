import { SUPPORT_EMAIL } from '../../data/mock'
import { LegalPage } from './LegalPage'

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="6 October 2026"
      intro="This page explains what Pexora does with the information you enter. The short version: it stays in your browser."
      sections={[
        {
          heading: 'What you enter',
          paragraphs: [
            'Your nickname, email, balances, trades, settings and notifications are saved in your browser on this device. They are not sent to a server, because Pexora does not have one.',
            'The photos and ID details in the identity check are only used on the page while you are on it. They are never uploaded or saved.',
          ],
        },
        {
          heading: 'Other companies',
          paragraphs: [
            'The page loads its fonts from Google Fonts, so Google can see that your device asked for them. Pexora does not use advertising, analytics or tracking tools.',
          ],
        },
        {
          heading: 'Your PIN and password',
          paragraphs: [
            'In this demo your transaction PIN is kept in your browser so the app can check it. A real service would never do this. Please do not reuse a real PIN or password here.',
          ],
        },
        {
          heading: 'Deleting your information',
          paragraphs: [
            'Go to Settings and choose Reset demo data to clear your balances, trades and settings, or log out and clear your browser data to remove everything.',
          ],
        },
        {
          heading: 'Questions',
          paragraphs: [`If anything here is unclear, write to ${SUPPORT_EMAIL}.`],
        },
      ]}
    />
  )
}
