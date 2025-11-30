import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, useToast, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import logo from '../img/motor.jpeg'
import axios from 'axios'
import fondo from '../img/fondo.jpeg'


function ClientForm({apiRender}) {

    // Manejo del formulario
    const [ formData, setFormData ] = useState({
        nombre: '',
        telefono: '',
        email: ''
    });

    // Notificaciones
    const toast = useToast()

    const navegate = useNavigate()

    // Traer los datos del input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validacion basica del formulario
        if(!formData.nombre || !formData.telefono) {
            toast({
                title: 'Error',
                description: 'Por favor completa todos los campos.',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
            return;
        };

        try {
            //Peticion POST con Axios
            const response = await axios.post(`${apiRender}/api/postcliente`, formData);
            const clienteId = response.data.id

            toast({
                title: 'Exito',
                description: 'Cliente registrado con exito.',
                status: 'success',
                duration: 5000,
                isClosable: true
            });

            // Limpiamos el formulario despues de enviar
            setFormData({ 
                nombre: '',
                telefono: '',
                email: ''
            });

            console.log('Respuesta del Servidor', response.data)

            navegate(`/moto/${clienteId}`)

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar al cliente',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
            console.error('Error al enviar los datos al backend');
        }

    };
    
    return (
        <Box
            display='flex'
            flexDir='column'
            alignItems='center'
            h='100vh'
            backgroundImage={fondo} 
            backgroundColor='rgba(0, 0, 0, 0.7)' 
            backgroundBlendMode='overlay'
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
                                color: 'secundario.2',
                                transform: 'scale(1.1)',
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
                                color: 'secundario.2',
                                transform: 'scale(1.1)',
                            }}
                            >
                            Registro Completo
                        </Button>
                    </Link>
                </Flex>
            </Flex>
            <Flex
                mt='20px'
                bg='white'
                padding={['30px','50px','50px']}
                justifyContent='center'
                alignItems='center'
                h='auto'
                w='auto'
                borderRadius='10px'
                boxShadow="0px 15px 25px rgba(0, 0, 0, 0.3)"
                transform="translateY(-20px)" 
                _hover={{
                    boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.5)", 
                    transform: "translateY(-30px) scale(1.02)", 
                    transition: "all 0.3s ease-in-out", 
                }}
                transition="all 0.3s ease-in-out"
                >
                <form
                    onSubmit={ handleSubmit }
                    >
                    <Stack spacing={4}>
                        <FormControl 
                            id='nombre' 
                            isRequired
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                Nombre
                            </FormLabel>
                            <Input
                                value={formData.nombre}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='text'
                                name='nombre'
                                placeholder='Ingresa el nombre del cliente'
                                />
                        </FormControl>

                        <FormControl 
                            id='telefono' 
                            isRequired
                            >
                            <FormLabel textAlign='center'>
                                Telefono
                            </FormLabel>
                            <Input 
                                value={formData.telefono}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px'
                                type='number'
                                name='telefono'
                                placeholder='Ingresa el telefono del cliente'
                                />
                        </FormControl>

                        <FormControl 
                            id='email' 
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                Email
                            </FormLabel>
                            <Input
                                value={formData.email}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='email'
                                name='email'
                                placeholder='Ingresa el email del cliente'
                                />
                        </FormControl>

                        <Button
                            type='submit'
                            bg='primario.1'
                            color='secundario.2'
                            boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                            transition="box-shadow 0.3s ease"
                            _hover={{
                                color: 'secundario.2',
                                transform: 'scale(1.1)',
                            }}
                            >
                            Registrar Cliente
                        </Button>
                    </Stack>
                </form>
            </Flex>
        </Box>
    )
}

export default ClientForm