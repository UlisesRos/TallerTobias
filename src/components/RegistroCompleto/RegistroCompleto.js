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
    Input,
    Select
} from '@chakra-ui/react';
import logo from '../../img/motor.png'
import ClienteModal from './ClienteModal';
import MontoModal from './MontoModal';
import { Link } from 'react-router-dom';

const apiRender = 'https://tallertobiasbackend.onrender.com' || 'http://localhost:5000'

const RegistroCompleto = () => {
    const [registros, setRegistros] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [filtrados, setFiltrados] = useState([]);
    const [verUltimos30Dias, setVerUltimos30Dias] = useState(false);
    const [ordenProximoServicio, setOrdenProximoServicio] = useState(false);
    const [busqueda, setBusqueda] = useState('')
    const [mesSeleccionado, setMesSeleccionado] = useState('')
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

    //Funcion para seleccionar el mes
    const handleMesChange = (e) => {
        setMesSeleccionado(e.target.value)
    }
    
    //Funcion para buscar por nombre
    const registrosFiltrados = registros
    .filter((registro) => registro.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(registro => {
        if (!verUltimos30Dias) return true;
        // Aquí calcula la diferencia de días y filtra
        const fechaEntrega = new Date(registro.Servicios[0].fechaEntrega);
        const hoy = new Date();
        const diferenciaDias = (hoy - fechaEntrega) / (1000 * 60 * 60 * 24);
        return diferenciaDias <= 30;
    })
    // Ordenar por próximo servicio si está activado
    .sort((a, b) => {
        if (!ordenProximoServicio) return 0;
        return a.Servicios[0].proximoServicio - b.Servicios[0].proximoServicio;
    })
    .filter((registro) => {
        const fechaEntrega = new Date(registro.Servicios[0].fechaEntrega);
        return mesSeleccionado 
        ? fechaEntrega.getMonth() + 1 === parseInt(mesSeleccionado, 10)
        : true
    })
    
    // Total de ganancias acumuladas
    const montoNumerico = registrosFiltrados.map(registro => parseInt(registro.Servicios[0].monto));
    const sumaMonto = montoNumerico.reduce((ac, va) => ac + va, 0);

    // Formato de fecha DD-MM-YYYY
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };
    
    return (
        <Box maxW="90%" mx="auto" mt="2" p="4">
            <Flex
                flexDir={['column', 'row', 'row']}
                rowGap='20px'
                justifyContent='space-between'
                alignItems='center'
                >
                <Image bgColor='black' borderRadius='100px' src={logo} alt='logo del taller' w='90px' h='90px' padding='4px'/>
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
                justifyContent='center'
                columnGap='15px'
                flexWrap='wrap'
                >
                <Select
                    placeholder="Seleccionar mes"
                    onChange={handleMesChange}
                    value={mesSeleccionado}
                    w='200px'
                    textAlign='center'
                    mb={4}
                    border='solid black 1px'
                >
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </Select>
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
                            <Th textAlign='center'>Cliente</Th>
                            <Th textAlign='center'>Moto</Th>
                            <Th textAlign='center'>Patente</Th>
                            <Th textAlign='center'>KM</Th>
                            <Th textAlign='center'>Servicio</Th>
                            <Th textAlign='center'>Monto</Th>
                            <Th textAlign='center'>Proximo Servicio</Th>
                            <Th textAlign='center'>Desc. Prox. Servicio</Th>
                            <Th textAlign='center'>Fecha de Entrega</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {registrosFiltrados.map((registro) => (
                            <Tr key={registro.id}>
                                <Td textAlign='center'>
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
                                <Td textAlign='center' textTransform='capitalize'>{`${registro.Motos[0].marca} ${registro.Motos[0].modelo}`}</Td>
                                <Td textAlign='center' textTransform='uppercase'>{registro.Motos[0].patente}</Td>
                                <Td textAlign='center'>
                                    {registro.Motos[0].km ? `${registro.Motos[0].km} KMS` : '-'}
                                </Td>
                                <Td
                                    textAlign='center'
                                    w='300px'
                                    maxW='300px'
                                    overflowY='auto'
                                    whiteSpace='normal'
                                    textOverflow='ellipsis'
                                    css={{
                                        maxHeight: '200px',
                                        overflowY: 'auto'
                                    }}
                                    >{registro.Servicios[0].descripcion}</Td>
                                <Td textAlign='center'>$ {registro.Servicios[0].monto}</Td>
                                <Td textAlign='center'>
                                    {
                                        (registro.Servicios[0].proximoServicio).length > 0 ? 
                                        registro.Servicios[0].proximoServicio === 'Realizar Proximo Servicio' ? 'Realizar Proximo Servicio' : `${registro.Servicios[0].proximoServicio} Días` : '-'
                                    }
                                </Td>
                                <Td
                                    textAlign='center'
                                    w='300px'
                                    maxW='300px'
                                    overflowY='auto'
                                    whiteSpace='normal'
                                    textOverflow='ellipsis'
                                    css={{
                                        maxHeight: '200px',
                                        overflowY: 'auto'
                                    }}
                                    >
                                    {
                                        registro.Servicios[0].descripcionProximoServicio ? registro.Servicios[0].descripcionProximoServicio : '-'
                                    }
                                </Td>
                                <Td textAlign='center'>{formatDate((registro.Servicios[0].fechaEntrega).slice(0, 10))}</Td>
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
