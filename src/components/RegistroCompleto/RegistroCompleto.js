import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Heading,
    useDisclosure,
    Text,
    Button,
    Flex,
    Image,
    useToast,
    Input
} from '@chakra-ui/react';
import logo from '../../img/motor.png'
import ClienteModal from './ClienteModal';
import MontoModal from './MontoModal';
import { Link } from 'react-router-dom';

const apiRender = 'https://tallertobiasback.onrender.com' || 'http://localhost:5000'

const RegistroCompleto = () => {
    const [registros, setRegistros] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [filtrados, setFiltrados] = useState([]);
    const [verUltimos30Dias, setVerUltimos30Dias] = useState(false);
    const [ordenProximoServicio, setOrdenProximoServicio] = useState(false);
    const [busqueda, setBusqueda] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure();

    //Notificaciones
    const toast = useToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiRender}/registrocompleto`);
                setRegistros(response.data);
                setFiltrados(response.data); // Inicialmente mostrar todos los registros
            } catch (error) {
                console.error('Error al obtener registros:', error);
            }
        };
        fetchData();
    }, []);

    // Ver Modal con los datos del cliente
    const handleClienteClick = (cliente) => {
        setClienteSeleccionado(cliente);
        onOpen();
    };

    
    // Funcion para eliminar un cliente
    const handleEliminarCliente = async (id) => {
        try {
            await axios.delete(`${apiRender}/registrocompleto/${id}`);
            setRegistros(registros.filter(registro => registro.id !== id));
            setTimeout(() => {
                window.location.reload()
            }, );
            toast({
                title: 'Exito!',
                description: 'El cliente fue eliminado con exito',
                status: 'success',
                duration: 5000,
                isClosable: true
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar al cliente',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
            console.error('Error al eliminar el cliente', error)
        }
    };
    
    //Funcion para buscar por nombre
    const registrosFiltrados = registros
    .filter((registro) => registro.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(registro => {
        if (!verUltimos30Dias) return true;
        // Aquí calcula la diferencia de días y filtra
        const fechaRecepcion = new Date(registro.Servicios[0].fechaRecepcion);
        const hoy = new Date();
        const diferenciaDias = (hoy - fechaRecepcion) / (1000 * 60 * 60 * 24);
        return diferenciaDias <= 30;
    })
    // Ordenar por próximo servicio si está activado
    .sort((a, b) => {
        if (!ordenProximoServicio) return 0;
        return a.Servicios[0].proximoServicio - b.Servicios[0].proximoServicio;
    });
    
    // Total de ganancias acumuladas
    const montoNumerico = registrosFiltrados.map(registro => parseInt(registro.Servicios[0].monto));
    const sumaMonto = montoNumerico.reduce((ac, va) => ac + va, 0);
    
    return (
        <Box maxW="90%" mx="auto" mt="2" p="4">
            <Flex
                flexDir={['column', 'row', 'row']}
                rowGap='20px'
                justifyContent='space-between'
                alignItems='center'
                >
                <Image bgColor='black' borderRadius='100px' src={logo} alt='logo del taller' w='90px' h='90px' />
                <Flex
                    flexDir={['column', 'row', 'row']}
                    rowGap='20px'
                    justifyContent='space-between'
                    alignItems='center'
                    w='250px'
                    wrap='wrap'
                    mb='30px'
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
                        to='/cliente'
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
                            Nuevo Cliente
                        </Button>
                    </Link>
                </Flex>
            </Flex>
            <Heading mb="6" textAlign="center">Registro Completo de Servicios</Heading>
            <Flex
                justifyContent='center'
                >
                <Input
                    border='solid 1px black'
                    textAlign='center'
                    mb='15px'
                    w={['80%','60%','40%']}
                    placeholder='Buscar cliente por Nombre'
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    />
            </Flex>
            <Box
                display='flex'
                justifyContent='start'
                columnGap='15px'
                flexWrap='wrap'
                >
                <Button onClick={() => setVerUltimos30Dias(!verUltimos30Dias)} colorScheme="blue" mb="4">
                    {verUltimos30Dias ? 'Mostrar Todos' : 'Filtrar ultimos 30 dias'}
                </Button>
                <Button onClick={() => setOrdenProximoServicio(!ordenProximoServicio)} colorScheme="green" mb="4">
                    {ordenProximoServicio ? 'Ordenar por Fecha de Creacion' : 'Ordenar por Próximo Servicio'}
                </Button>

            </Box>
            <TableContainer mt='20px' >
                <Table variant="striped" colorScheme="teal">
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Cliente</Th>
                            <Th>Moto</Th>
                            <Th>Patente</Th>
                            <Th>Servicio</Th>
                            <Th>Monto</Th>
                            <Th>Proximo Servicio</Th>
                            <Th>Fecha de Recepcion</Th>
                            <Th>Fecha de Entrega</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {registrosFiltrados.map((registro) => (
                            <Tr key={registro.id}>
                                <Td>
                                    <Button
                                        fontSize='sm'
                                        colorScheme='red'
                                        ml='3px'
                                        boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                                        transition="box-shadow 0.3s ease"
                                        _hover={{
                                            boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                                        }}
                                        onClick={() => handleEliminarCliente(registro.id)}
                                        >
                                    Eliminar
                                    </Button>
                                </Td>
                                <Td>
                                    <Text
                                        as='button'
                                        _hover={{
                                            transform: 'scale(1.1)'
                                        }}
                                        onClick={() => handleClienteClick(registro)}
                                        textTransform='capitalize'
                                    >
                                        {registro.nombre}
                                    </Text>
                                </Td>
                                <Td textTransform='capitalize'>{`${registro.Motos[0].marca} ${registro.Motos[0].modelo}`}</Td>
                                <Td textAlign='center' textTransform='uppercase'>{registro.Motos[0].patente}</Td>
                                <Td>{registro.Servicios[0].descripcion}</Td>
                                <Td>$ {registro.Servicios[0].monto}</Td>
                                <Td textAlign='center'>
                                    {
                                        (registro.Servicios[0].proximoServicio).length > 0 ? 
                                        `${registro.Servicios[0].proximoServicio} Días` :
                                        '-'
                                    }
                                </Td>
                                <Td textAlign='center'>{(registro.Servicios[0].fechaRecepcion).slice(0, 10)}</Td>
                                <Td textAlign='center'>{(registro.Servicios[0].fechaEntrega).slice(0, 10)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Flex
                justifyContent='center'
                >
                <MontoModal sumaMonto={sumaMonto} />
            </Flex>
            { clienteSeleccionado && (
                <ClienteModal isOpen={isOpen} onClose={onClose} clienteSeleccionado={clienteSeleccionado} />
            )}
        </Box>
    );
};

export default RegistroCompleto;
