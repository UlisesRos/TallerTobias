import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, useToast, Textarea, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../img/motor.png'

const apiRender = 'https://tallertobiasback.onrender.com' || 'http://localhost:5000'

function ServicioForm() {

    const { clienteId } = useParams();
    
    const [ formData, setFormData ] = useState({
        descripcion: '',
        fechaRecepcion: new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }),
        fechaEntrega: '',
        monto: '',
        proximoServicio: '',
        clienteId
    });

    const navegate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!formData.descripcion || !formData.monto){
            toast({
                title: 'Error',
                description: 'Completa todos los campos',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
            return
        }

        try {
            const response = await axios.post(`${apiRender}/api/postservicio`, formData);

            toast({
                title: 'Exito',
                description: 'Servicio Registrado con Exito',
                status: 'success',
                duration: 5000,
                isClosable: true
            })

            console.log('Respuesta del Servidor', response.data)
            navegate('/registrocompleto')
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar el servicio',
                status: 'error',
                duration: 5000,
                isClosable: true
            })

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
                padding='20px 40px 20px 40px'
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
                            id='descripcion' 
                            isRequired
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                Descripcion
                            </FormLabel>
                            <Textarea
                                value={formData.descripcion}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='text'
                                name='descripcion'
                                placeholder='Ingresa la descripcion del servicio'
                                />
                        </FormControl>

                        <FormControl 
                            id='fechaRecepcion' 
                            isRequired
                            >
                            <FormLabel textAlign='center'>
                                Fecha de Recepcion
                            </FormLabel>
                            <Input 
                                value={formData.fechaRecepcion}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px'
                                type='date'
                                name='fechaRecepcion'
                                isReadOnly
                                />
                        </FormControl>

                        <FormControl 
                            id='fechaEntrega'
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                Fecha de Entrega
                            </FormLabel>
                            <Input
                                value={formData.fechaEntrega}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='date'
                                name='fechaEntrega'
                                placeholder='Selecciona la fecha de entrega'
                                />
                        </FormControl>

                        <FormControl 
                            id='monto'
                            isRequired
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                $ Monto
                            </FormLabel>
                            <Input
                                value={formData.monto}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='number'
                                name='monto'
                                placeholder='Ingresa el monto a cobrar'
                                />
                        </FormControl>

                        <FormControl 
                            id='proximoServicio'
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                Dias para el Proximo Servicio
                            </FormLabel>
                            <Input
                                value={formData.proximoServicio}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='number'
                                name='proximoServicio'
                                placeholder='Ingresa los dias para el proximo servicio'
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

export default ServicioForm