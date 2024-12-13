import { Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, useDisclosure } from "@chakra-ui/react"

const MontoModal = ({sumaMonto}) => {

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
                    boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
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
                            >
                                Ganancia Acumulada
                        </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text
                            textAlign='center'
                            fontSize='lg'
                            >
                            Ganancia: ${sumaMonto}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default MontoModal