import { Button, Flex, Heading, Image } from '@chakra-ui/react'
import logo from '../../img/motor.jpeg'
import TypingEffect from './TypingEffect'
import { Link } from 'react-router-dom'

function Home() {

    const texto = '¡Bienvenido al Sistema de Gestión de Tobias!'
    return (
        <Flex
            bg='secundario.2'
            h='100vh'
            color='white'
            justifyContent='center'
            alignItems='center'
            flexDir='column'
            className='courier-prime-bold'
            >
            <Heading
                textAlign='center'
                fontSize={['2rem','2.3rem','2.5rem']}
                >
                <TypingEffect text={texto} speed={120} />
            </Heading>
            <Image src={logo} alt='logo del taller' w='350px' h='350px'/>
            <Flex
                flexDir={['column', 'row', 'row']}
                rowGap='15px'
                justifyContent='space-around'
                alignItems='center'
                w={['100%','90','70%']}
                mt='20px'
                >
                <Link
                    to={'/calendario'}
                    >
                    <Button
                        _hover={{
                            transform: 'scale(1.1)'
                        }}
                        >
                        Calendario
                    </Button>
                </Link>
                <Link
                    to={'/registrocompleto'}
                    >
                    <Button 
                        _hover={{
                            transform: 'scale(1.1)'
                        }}
                    >
                        Registros Completos
                    </Button>
                </Link>
                <Link
                    to={'/cliente'}
                    >
                    <Button
                        _hover={{
                            transform: 'scale(1.1)'
                        }}
                        >
                        Nuevo Cliente
                    </Button>
                </Link>
            </Flex>
        </Flex>
    )
}

export default Home