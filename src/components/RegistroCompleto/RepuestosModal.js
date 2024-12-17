import { Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, useDisclosure, useToast, Input, List, ListItem } from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react";

const RepuestosModal = ({ registroId, apiRender, registrosFiltrados }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ repuesto, setRepuesto ] = useState('')
    const [ listaRepuestos, setListaRepuestos ] = useState([])

    const toast = useToast()

    //Agregar repuesto a la lista
    const handleAddRepuesto = () => {
        if(repuesto.trim()) {
            setListaRepuestos([...listaRepuestos, repuesto.trim()]);
            setRepuesto('');
        }
    };

    // Función para eliminar un repuesto de la lista no guardada
    const handleDeleteRepuestoListFront = (repuesto) => {
        // Filtrar el repuesto a eliminar de la lista de repuestos no guardados
        const updatedRepuestos = listaRepuestos.filter(item => item !== repuesto);
        setListaRepuestos(updatedRepuestos);

        toast({
            title: 'Repuesto eliminado',
            description: 'El repuesto ha sido eliminado correctamente.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    // Función para eliminar un repuesto
    const handleDeleteRepuesto = async (repuesto) => {
        try {
            await axios.delete(`${apiRender}/api/deleterepuesto/${registroId}/${repuesto}`);
            // Filtrar el repuesto eliminado en el frontend
            setListaRepuestos(listaRepuestos.filter(item => item !== repuesto));
            toast({
                title: 'Repuesto eliminado',
                description: 'El repuesto se ha eliminado correctamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        } catch (error) {
            toast({
                title: 'Error al eliminar repuesto',
                description: 'No se pudo eliminar el repuesto.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Error al eliminar el repuesto', error);
        }
    };

    // Enviar lista al backend
    const handleSaveRepuestos = async (id) => {
        try {

            await axios.put(`${apiRender}/api/updaterepuestos/${id}`, { repuestos: listaRepuestos });
            toast({
                title: 'Exito',
                description: 'Repuestos agregados con exito',
                status: 'success',
                duration: 3000,
                isClosable: true
            })
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudieron agregar los repuestos',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
            console.error('Error al guardar los repuestos', error)
        }

    }
    return (
        <>
            <Button
                size='md'
                bg='#FDA633 '
                color='black'
                boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                transition="box-shadow 0.3s ease"
                _hover={{
                    color: 'black',
                    boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                }}
                onClick={onOpen}
                >
                Lista de Repuestos
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent w='80%'>
                        <ModalHeader
                            textAlign='center'
                            fontWeight='bold'
                            >
                                Repuestos Necesarios
                        </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        
                        
                        <Text
                            mt={4}
                            fontWeight='bold'
                            >
                            {
                                registrosFiltrados.map(reg => ( 
                                    reg.Servicios[0].clienteId === registroId ?
                                    reg.Servicios[0].listaRepuestos.length > 0 ? 'Repuestos actuales' : 'No hay repuestos aun' :
                                    ''
                                ))
                            }
                        </Text>

                        <List
                            spacing={3}
                            mt={2}
                            textTransform='capitalize'
                            mb={2}
                            >
                            {registrosFiltrados.map((registro) => (
                                registro.Servicios[0].clienteId === registroId ?
                                registro.Servicios[0].listaRepuestos.map((item, index) => (
                                <ListItem key={index}>
                                    {index +1}. {item}
                                    <Text
                                        as='button'
                                        size='sm'
                                        color='red'
                                        _hover={{
                                            transform: 'scale(1.1)'
                                        }}
                                        ml={2} 
                                        onClick={() => handleDeleteRepuesto(item)}>
                                        Eliminar
                                    </Text>
                                </ListItem>
                                )) : null
                            ))}
                        </List>

                        <Input 
                            placeholder="Ingrese un repuesto"
                            value={repuesto}
                            onChange={(e) => setRepuesto(e.target.value)}
                            mb={4}
                        />

                        <Button
                            size='md'
                            bg='#FDA633 '
                            color='black'
                            boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                            transition="box-shadow 0.3s ease"
                            _hover={{
                                color: 'black',
                                boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                            }}
                            mr={3}
                            onClick={handleAddRepuesto}
                            >
                            Agregar Repuesto
                        </Button>

                        <Text
                            mt={4}
                            fontWeight='bold'
                            >
                            Agregar los siguientes repuestos:
                        </Text>

                        <List
                            spacing={3}
                            mt={2}
                            textTransform='capitalize'
                            >
                            {listaRepuestos.map((item, index) => (
                                <ListItem key={index}>
                                    {index +1}. {item}
                                    <Text 
                                        as='button'
                                        size='sm'
                                        color='red'
                                        _hover={{
                                            transform: 'scale(1.1)'
                                        }}
                                        ml={2} 
                                        onClick={() => handleDeleteRepuestoListFront(item)}
                                        >
                                        Eliminar
                                    </Text>
                                </ListItem>
                            ))}
                        </List>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                        size='md'
                        bg='#FDA633 '
                        color='black'
                        boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                        transition="box-shadow 0.3s ease"
                        _hover={{
                            color: 'black',
                            boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                        }}
                        mr={3} 
                        onClick={() => handleSaveRepuestos(registroId)} 
                        isDisabled={!listaRepuestos.length}>
                            Guardar
                        </Button>
                        <Button colorScheme='red' color='black' onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default RepuestosModal