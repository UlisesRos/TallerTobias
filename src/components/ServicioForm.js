import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, useToast, Textarea, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../img/motor.png'
import fondo from '../img/fondo.jpg'

function ServicioForm({apiRender}) {

    const { clienteId } = useParams();
    
    const [ formData, setFormData ] = useState({
        descripcion: '',
        fechaEntrega: new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }),
        montoManoObra: '',
        montoRepuesto: '',
        proximoServicio: '',
        kmProximoServicio: '',
        descripcionProximoServicio: '',
        pago: '',
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

        if(!formData.descripcion || !formData.montoManoObra || !formData.montoRepuesto){
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
            h='auto'
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
                            id='fechaEntrega' 
                            isRequired
                            >
                            <FormLabel textAlign='center'>
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
                                isReadOnly
                                />
                        </FormControl>

                        <FormControl 
                            id='montoManoObra'
                            isRequired
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                $ Monto Mano de Obra
                            </FormLabel>
                            <Input
                                value={formData.montoManoObra}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='number'
                                name='montoManoObra'
                                placeholder='Ingresa el monto a cobrar de mano de obra'
                                />
                        </FormControl>

                        <FormControl 
                            id='montoRepuesto'
                            isRequired
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                $ Monto de Repuestos
                            </FormLabel>
                            <Input
                                value={formData.montoRepuesto}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='number'
                                name='montoRepuesto'
                                placeholder='Ingresa el monto a cobrar de repuestos'
                                />
                        </FormControl>

                        <FormControl 
                            id='pago'
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                $ Pago Realizado
                            </FormLabel>
                            <Input
                                value={formData.pago}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='number'
                                name='pago'
                                placeholder='Ingresa el monto cobrado'
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

                        <FormControl 
                            id='kmProximoServicio'
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                Kilometros para el Proximo Servicio
                            </FormLabel>
                            <Input
                                value={formData.kmProximoServicio}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='number'
                                name='kmProximoServicio'
                                placeholder='Ingresa los kilometros para el proximo servicio'
                                />
                        </FormControl>

                        <FormControl 
                            id='descripcionProximoServicio'
                            >
                            <FormLabel
                                textAlign='center'
                                >
                                Descripcion del Prox Servicio
                            </FormLabel>
                            <Textarea
                                value={formData.descripcionProximoServicio}
                                onChange={handleChange}
                                fontWeight='medium'
                                textAlign='center'
                                w='280px' 
                                type='text'
                                name='descripcionProximoServicio'
                                placeholder='Ingresa la descripcion del prox servicio'
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
                            Registrar Moto
                        </Button>
                    </Stack>
                </form>
            </Flex>
        </Box>
    )
}

export default ServicioForm