import { Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, useDisclosure } from "@chakra-ui/react"

const MontoModal = ({registrosFiltrados}) => {

    // Total de ganancias acumuladas
        const montoNumerico = registrosFiltrados.map(registro => parseInt(registro.Servicios[0].montoManoObra));
        const montoTotal = registrosFiltrados.map(registro => parseInt(registro.Servicios[0].monto));
        const deudaNumerico = registrosFiltrados.map(registro => parseInt(registro.Servicios[0].deuda));
        const sumaMontoManoObra = montoNumerico.reduce((ac, va) => ac + va, 0);
        const sumaMontoTotal = montoTotal.reduce((ac, va) => ac + va, 0);
        const sumaDeuda = deudaNumerico.reduce((ac, va) => ac + va, 0);

    const { isOpen, onOpen, onClose } = useDisclosure();
        
    return (
        <>
            <Button
                bg='#FDA633 '
                color='black'
                boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                transition="box-shadow 0.3s ease"
                _hover={{
                    color: 'black',
                    transform: 'scale(1.1)',
                    boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(56, 31, 31, 0.2)"
                }}
                onClick={onOpen}
                >
                Total de Ganancias
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent w='80%'>
                        <ModalHeader
                            textAlign='center'
                            fontWeight='bold'
                            >
                                Ganancia/Deuda Acumulada
                        </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text
                            textAlign='center'
                            fontSize='lg'
                            mb='10px'
                            >
                            <strong>Ganancia Total de Mano de Obra:</strong> ${sumaMontoManoObra}
                        </Text>

                        <Text
                            textAlign='center'
                            fontSize='lg'
                            mb='10px'
                            >
                            <strong>Ganancia Total con Repuestos:</strong> ${sumaMontoTotal}
                        </Text>

                        <Text
                            textAlign='center'
                            fontSize='lg'
                            >
                            <strong>Total Deudas:</strong> ${sumaDeuda}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default MontoModal