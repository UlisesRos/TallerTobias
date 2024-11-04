import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, useToast, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../img/motor.png'

const apiRender = 'https://tallertobiasback.onrender.com' || 'http://localhost:5000'

function MotoForm() {

    const { clienteId } = useParams();
    const [ formData, setFormData ] = useState({
        marca:'',
        modelo:'',
        patente:'',
        clienteId
    });

    const navegate = useNavigate()
    const toast = useToast()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [ name ]: value,
        })
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!formData.marca || !formData.modelo || !formData.patente){
            toast({
                title: 'Error',
                description: 'Completa todos los campos',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
            return
        }

        if(!(formData.patente.length > 5) || !(formData.patente.length < 8)){
            toast({
                title: 'Error',
                description: 'La patente no tiene el formato adecuado.',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
            return
        }

        try {
            const response = await axios.post(`${apiRender}/api/postmoto`, formData);

            toast({
                title: 'Exito',
                description: 'Moto registrada correctamente',
                status:'success',
                duration: 5000,
                isClosable: true
            })

            console.log('Respuesta del Servidor', response.data)

            navegate(`/servicio/${clienteId}`)

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar la moto',
                status: 'error',
                duration: 5000,
                isClosable: true
            });

            console.error('Error al enviar los datos al backend', error)
        }
    }

    return (
        <Box
            display='flex'
            flexDir='column'
            alignItems='center'
            h='100vh'
            >
            <Flex
                flexDir={['column', 'row', 'row']}
                rowGap='20px'
                justifyContent='space-between'
                alignItems='center'
                mt='20px'
                mb={['50px','30px','30px']}
                w='90%'
                >
                <Image bgColor='black' borderRadius='100px' src={logo} alt='logo del taller' w='90px' h='90px' padding='4px'/>
                <Flex
                    flexDir={['column', 'row', 'row']}
                    rowGap='20px'
                    justifyContent='space-between'
                    alignItems='center'
                    w='300px'
                    wrap='wrap'
                    >
                    <Link
                        to='/'
                        >
                        <Button
                            bg='primario.1'
                            color='secundario.2'
                            boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                            transition="box-shadow 0.3s ease"
                            _hover={{
                                color: 'white',
                                border: 'solid 1px black',
                                boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                            }}
                            >
                            Home
                        </Button>
                    </Link>
                    <Link
                        to='/registrocompleto'
                        >
                        <Button
                            bg='primario.1'
                            color='secundario.2'
                            boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                            transition="box-shadow 0.3s ease"
                            _hover={{
                                color: 'white',
                                border: 'solid 1px black',
                                boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                            }}
                            >
                            Registro Completo
                        </Button>
                    </Link>
                </Flex>
            </Flex>
            <Flex
                padding={['30px','50px','50px']}
                justifyContent='center'
                alignItems='center'
                h='auto'
                w='auto'
                borderRadius='10px'
                boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                _hover={{
                    boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                }}
                transition="box-shadow 0.3s ease"
                >
                <form
                    onSubmit={ handleSubmit }
                    >
                    <Stack spacing={4}>
                        <FormControl 
                            id='marca' 
                            isRequired
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                Marca
                            </FormLabel>
                            <Input
                                value={formData.marca}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='text'
                                name='marca'
                                placeholder='Ingresa la marca de la moto'
                                />
                        </FormControl>

                        <FormControl 
                            id='modelo' 
                            isRequired
                            >
                            <FormLabel textAlign='center'>
                                Modelo
                            </FormLabel>
                            <Input 
                                value={formData.modelo}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px'
                                type='text'
                                name='modelo'
                                placeholder='Ingresa el modelo de la moto'
                                />
                        </FormControl>

                        <FormControl 
                            id='patente'
                            isRequired
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                Patente
                            </FormLabel>
                            <Input
                                value={formData.patente}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='text'
                                name='patente'
                                placeholder='Ingresa la patente de la moto'
                                />
                        </FormControl>

                        <Button
                            type='submit'
                            bg='primario.1'
                            color='secundario.2'
                            boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                            transition="box-shadow 0.3s ease"
                            _hover={{
                                color: 'white',
                                border: 'solid 1px black',
                                boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                            }}
                            >
                            Registrar Moto
                        </Button>
                    </Stack>
                </form>
            </Flex>
        </Box>
    )
}


export default MotoForm