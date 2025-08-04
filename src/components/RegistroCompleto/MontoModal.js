import { Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, useDisclosure } from "@chakra-ui/react"

const MontoModal = ({registrosFiltrados}) => {

    console.log(registrosFiltrados.map(registro => parseInt(registro.Servicios[0].montoRepuesto)))

    // Total de ganancias acumuladas
        const montoNumerico = registrosFiltrados.map(registro => parseInt(registro.Servicios[0].montoManoObra));
        const deudaNumerico = registrosFiltrados.map(registro => parseInt(registro.Servicios[0].deuda));
        const sumaMontoManoObra = montoNumerico.reduce((ac, va) => ac + va, 0);
        const sumaDeuda = deudaNumerico.reduce((ac, va) => ac + va, 0);
        const sumaMontoRepuestos = parseFloat(
            registrosFiltrados
                .map(registro => parseInt(registro.Servicios[0].montoRepuesto) * 0.10)
                .reduce((acc, val) => acc + val, 0)
            );
        const sumaTotal = sumaMontoManoObra + sumaMontoRepuestos

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
                            <strong>Ganancia Total de Mano de Obra:</strong> ${sumaMontoManoObra.toLocaleString("es-AR")}
                        </Text>

                        <Text
                            textAlign='center'
                            fontSize='lg'
                            mb='10px'
                            >
                            <strong>Ganancia Total con Repuestos:</strong> ${sumaTotal.toLocaleString("es-AR")}
                        </Text>

                        <Text
                            textAlign='center'
                            fontSize='lg'
                            >
                            <strong>Total Deudas:</strong> ${sumaDeuda.toLocaleString("es-AR")}
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