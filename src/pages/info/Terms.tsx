import { SUPPORT_EMAIL } from '../../data/mock'
import { LegalPage } from './LegalPage'

export default function Terms() {
  return (
    <LegalPage
      title="Terms of service"
      updated="6 October 2026"
      intro="These terms explain how you may use Pexora. Pexora is a demo built for a portfolio, so please read section 1 first."
      sections={[
        {
          heading: 'This is a demo',
          paragraphs: [
            'Pexora does not hold, send or receive real money or real cryptocurrency. Balances, offers, trades, transfers and statements are examples made for the demo.',
            'Nothing here is financial advice, and nothing here is a real financial service.',
          ],
        },
        {
          heading: 'Your account',
          paragraphs: [
            'You can create an account with an email address, a nickname and a password. Keep your password and transaction PIN private.',
            'The identity check in the app is a demonstration. Your photos and ID details are not uploaded or stored anywhere.',
          ],
        },
        {
          heading: 'How trading works',
          paragraphs: [
            'On the market you choose an offer from another person and trade at their rate. In this demo a trade completes straight away.',
            'Fees shown in the app, such as withdrawal and swap fees, are part of the demo and may change without notice.',
          ],
        },
        {
          heading: 'Using the app properly',
          paragraphs: [
            'Please do not try to break the app, overload it, or use it to harm anyone. Do not enter real card numbers, real bank details or real ID numbers.',
          ],
        },
        {
          heading: 'No promises',
          paragraphs: [
            'The demo is provided as it is, with no promise that it will always work or that it is free of mistakes. The people who built it are not responsible for losses from using it.',
          ],
        },
        {
          heading: 'Changes and questions',
          paragraphs: [`We may update these terms as the demo changes. Questions can go to ${SUPPORT_EMAIL}.`],
        },
      ]}
    />
  )
}
