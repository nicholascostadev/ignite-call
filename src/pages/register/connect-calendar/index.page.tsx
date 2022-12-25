import { Heading, MultiStep, Text, Button } from '@ignite-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ArrowRight, Check } from 'phosphor-react'
import { Container, Header } from '../styles'
import { knownErrors } from './known-errors'
import { AuthError, ConnectBox, ConnectItem } from './styles'

export default function ConnectCalendarPage() {
  const { status } = useSession()
  const router = useRouter()

  const authError = String(router.query.error)
  const hasAuthError = authError !== 'undefined'
  const isSignedIn = status === 'authenticated'

  const generateErrorMessage = () => {
    if (knownErrors[authError]) {
      return knownErrors[authError]
    }

    return 'Erro desconhecido. Tente novamente mais tarde.'
  }

  const handleConnectCalendar = async () => {
    await signIn('google')
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>
        <MultiStep size={4} currentStep={2} />

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            {isSignedIn ? (
              <Button size="sm" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleConnectCalendar}
              >
                Conectar
                <ArrowRight />
              </Button>
            )}
          </ConnectItem>

          {hasAuthError && (
            <AuthError size="sm">{generateErrorMessage()}</AuthError>
          )}

          <Button type="submit" disabled={!isSignedIn}>
            Próximo passo
            <ArrowRight />
          </Button>
        </ConnectBox>
      </Header>
    </Container>
  )
}
