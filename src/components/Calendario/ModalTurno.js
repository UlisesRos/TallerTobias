import { Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, Button, Stack, useDisclosure, Input, FormControl, FormLabel, Box, useToast } from "@chakra-ui/react"
import { useState } from "react";
import axios from 'axios'

const apiRender = 'https://tallertobiasbackend.onrender.com' || 'http://localhost:5000'

const ModalTurno = ({ selectedDate }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ formData, setFormData ] = useState({
        nombre: '',
        moto: '',
        descripcion: '',
        fecha: selectedDate
    });

    const toast = useToast()

    //Traer los datos del input
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Validacion Basica del formulario
        if(!formData.nombre || !formData.moto || !formData.descripcion) {
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
            const response = await axios.post(`${apiRender}/postturno`, formData);
            toast({
                title: 'Exito',
                description: 'Turno registrado con exito.',
                status: 'success',
                duration: 5000,
                isClosable: true
            });

            console.log('Respuesta del Servidor', response.data);

            onClose()
            window.location.reload()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar el turno',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
            console.error('Error al enviar los datos al back')
        }
    }



    return (
        <Box>
            <Button
                alignSelf='center'
                marginTop='20px'
                bg='primario.1'
                color='secundario.2'
                boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                transition="box-shadow 0.3s ease"
                _hover={{
                    color: 'white',
                    border: 'solid 1px black',
                    boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                }}
                onClick={onOpen}
                size='sm'
                >
                Agregar Turno
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent w='80%'>
                        <ModalHeader
                            >
                                Agregar Turno
                        </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        mb='15px'
                        >
                        <form
                            onSubmit={handleSubmit}
                            >
                            <Stack
                                spacing={4}
                                >
                                <FormControl
                                    id="nombre"
                                    isRequired
                                    >
                                    <FormLabel>
                                        Nombre
                                    </FormLabel>
                                    <Input
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        type="text"
                                        name='nombre'
                                        w='100%'
                                        placeholder='Ingresa el nombre'
                                        />
                                </FormControl>

                                <FormControl
                                    id="moto"
                                    isRequired
                                    >
                                    <FormLabel>
                                        Moto
                                    </FormLabel>
                                    <Input
                                        value={formData.moto}
                                        onChange={handleChange}
                                        type="text"
                                        name='moto'
                                        w='100%'
                                        placeholder='Ingresa la moto'
                                        />
                                </FormControl>

                                <FormControl
                                    id="descripcion"
                                    isRequired
                                    >
                                    <FormLabel>
                                        Trabajo a realizar
                                    </FormLabel>
                                    <Input
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        type="text"
                                        name='descripcion'
                                        w='100%'
                                        placeholder='Ingresa el trabajo a realizar'
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
                                    Registrar Turno
                                </Button>
                            </Stack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default ModalTurno