import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Heading,
    useDisclosure,
    Text,
    Button,
    Flex,
    Image,
    useToast,
    Input,
    Select,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Spinner
} from '@chakra-ui/react';
import logo from '../../img/motor.png'
import ClienteModal from './ClienteModal';  
import MontoModal from './MontoModal';
import { Link } from 'react-router-dom';
import casco from '../../img/casco.png'
import moto from '../../img/moto.png'
import mecanico from '../../img/mecanico.png'
import fondo from '../../img/fondo.jpg'

const apiRender = 'https://tallertobiasbackend.onrender.com' || 'http://localhost:5000'

const RegistroCompleto = () => {
    const [registros, setRegistros] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [filtrados, setFiltrados] = useState([]);
    const [verUltimos30Dias, setVerUltimos30Dias] = useState(false);
    const [ordenProximoServicio, setOrdenProximoServicio] = useState(false);
    const [busqueda, setBusqueda] = useState('')
    const [mesSeleccionado, setMesSeleccionado] = useState('')
    const [añoSeleccionado, setAñoSeleccionado] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [pago, setPago] = useState(0)
    const [isEditing, setIsEditing] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    //Notificaciones
    const toast = useToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiRender}/registrocompleto`);
                setRegistros(response.data);
                setFiltrados(response.data); // Inicialmente mostrar todos los registros
                setIsLoading(false)
            } catch (error) {
                console.error('Error al obtener registros:', error);
                setIsLoading(false)
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
        if(window.confirm('Estas seguro que quieres eliminar a este cliente?')){
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
        }
    };

    const handleChangePago = (e) => {
        setPago(e.target.value); // Actualiza el estado con el valor del input
    };

    const handleSavePago = async (id) => {
        try {
            // Enviar la actualización al backend
            const response = await axios.put(`/api/putservicios/${id}`, { pago });
            
            // Si la solicitud fue exitosa
            toast({
                title: 'Exito',
                description: 'Pago actualizado correctamente',
                status: 'success',
                duration: '3000',
                isClosable: true
            });
            setIsEditing(false); // Deja de editar después de guardar
        } catch (error) {
            // Manejo de errores
            console.error('Error al actualizar el pago', error);
            toast({
                title: 'Error',
                description: 'Hubo un problema al actualizar el pago',
                status: 'error',
                duration: '3000',
                isClosable: true
            });
        }
    };

    //Funcion para seleccionar el mes
    const handleMesChange = (e) => {
        setMesSeleccionado(e.target.value)
    }

    //Funcion para seleccionar el mes
    const handleAñoChange = (e) => {
        setAñoSeleccionado(e.target.value)
    }

    //Funcion para buscar por nombre
    const registrosFiltrados = registros
    .filter((registro) => registro.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((registro) => {
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
        const mes = fechaEntrega.getMonth() +1;
        const año = fechaEntrega.getFullYear();
        return (
            (!mesSeleccionado || mes === parseInt(mesSeleccionado, 10)) &&
            (!añoSeleccionado || año === parseInt(añoSeleccionado, 10))
        );
    });

    // Total de ganancias acumuladas
    const montoNumerico = registrosFiltrados.map(registro => parseInt(registro.Servicios[0].monto));
    const sumaMonto = montoNumerico.reduce((ac, va) => ac + va, 0);

    // Formato de fecha DD-MM-YYYY
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

    return (
        <Box maxW="100%" mx="auto" h='auto' minHeight='100vh' p="4" backgroundImage={fondo} backgroundColor='rgba(0, 0, 0, 0.7)' backgroundBlendMode='overlay'>
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
                                color: 'secundario.2',
                                transform: 'scale(1.1)',
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
                                color: 'secundario.2',
                                transform: 'scale(1.1)',
                            }}
                            >
                            Nuevo Cliente
                        </Button>
                    </Link>
                </Flex>
            </Flex>
            <Heading mb="6" textAlign="center" color='white' fontSize={['2rem','3rem','3rem']}>Registro Completo de Servicios</Heading>
            <Flex
                justifyContent='center'
                >
                <Input
                    textAlign='center'
                    mb='15px'
                    w={['80%','60%','40%']}
                    placeholder='Buscar cliente por Nombre'
                    bg='white'
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
                    bg='white'
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
                <Select
                    placeholder="Seleccionar año"
                    onChange={handleAñoChange}
                    value={añoSeleccionado}
                    w="200px"
                    textAlign="center"
                    mb={4}
                    bg="white"
                >
                    {Array.from({ length: 1 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        );
                    })}
                </Select>
                <Button onClick={() => setVerUltimos30Dias(!verUltimos30Dias)} colorScheme="blue" color='black' mb="4" _hover={{
                    color: 'black',
                    transform: 'scale(1.1)',
                    boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                }}>
                    {verUltimos30Dias ? 'Mostrar Todos' : 'Filtrar ultimos 30 dias'}
                </Button>
                <Button onClick={() => setOrdenProximoServicio(!ordenProximoServicio)} colorScheme="green" mb="4" color='black' _hover={{
                    color: 'black',
                    transform: 'scale(1.1)',
                    boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                }}>
                    {ordenProximoServicio ? 'Ordenar por Fecha de Creacion' : 'Ordenar por Próximo Servicio'}
                </Button>
                <Flex>
                    <MontoModal sumaMonto={sumaMonto} />
                </Flex>

            </Box>
            <Flex
                w='100%'
                alignItems='center'
                justifyContent='center'
                mt='30px'
                >
                {isLoading ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    mt='20px'
                    >
                    <Spinner size="xl" color="blue.500" />
                    <Text color='white'>Cargando datos...</Text>
                    </Box>
                ) : (  
                <Flex
                    w={['100%','85%','70%']}
                    flexDir='column'
                    >
                    <Accordion 
                        allowToggle
                        >
                        {registrosFiltrados.map((registro, index) => (
                            <AccordionItem 
                                border='none'
                                mb='20px'
                                key={registro.id}
                                >
                                {({ isExpanded }) => (
                                <Box
                                    borderRadius="md"
                                    boxShadow={isExpanded ? '0 10px 40px rgba(255, 0, 0, 1)' : '0 2px 6px rgba(0, 0, 0, 0.2)'}
                                    transition="all 0.3s ease-in-out"
                                    transform="translateY(-20px)" 
                                    _hover={{ 
                                        boxShadow: '0 10px 30px rgba(255, 0, 0, 1)',
                                        transform: "translateY(-30px) scale(1.02)", 
                                        transition: "all 0.3s ease-in-out", 
                                    }}
                                    bg="white"
                                    >
                                    <AccordionButton>
                                    <Box
                                        display='flex'
                                        flexDir='column'
                                        rowGap='10px'
                                        w='100%'
                                        alignItems='start'
                                        p={4}
                                        >
                                        <Text alignSelf='start'>{index + 1}</Text>
                                        <Flex
                                            columnGap='10px'
                                            alignItems='center'
                                            justifyContent='center'
                                            >
                                            <Image src={casco} alt='cliente' w='20px'/>
                                            <Text fontWeight="bold" textAlign='center' fontSize='lg'>{registro.nombre}</Text>
                                        </Flex>

                                        <Flex
                                            columnGap='10px'
                                            >
                                            <Image src={moto} alt='moto' w='25px' h='25px'/>
                                            <Text fontWeight="bold" textAlign='center'>{registro.Motos[0].marca} {registro.Motos[0].modelo}</Text>
                                        </Flex>

                                        <Flex
                                            columnGap='10px'
                                            >
                                            <Image src={mecanico} alt='proximoservicio' w='25px' h='25px'/>
                                            <Text><strong>Proximo Servicio:</strong>
                                                {
                                                    (registro.Servicios[0].proximoServicio).length > 0 ? 
                                                    parseInt(registro.Servicios[0].proximoServicio, 10) === 0 ? ' Realizar Proximo Servicio' : ` ${registro.Servicios[0].proximoServicio} Días` 
                                                    : ' -'
                                                }
                                            </Text>                                        
                                        </Flex>
                                    </Box>
                                    </AccordionButton>
                                    <AccordionPanel pb={4} textAlign='start'>
                                        <Text><strong>Patente:</strong> {registro.Motos[0].patente}</Text>
                                        <Text mt='8px'><strong>KM:</strong> {registro.Motos[0].km ? `${registro.Motos[0].km} KMS` : '-'}</Text>
                                        <Text mt='8px'><strong>Servicio:</strong> {registro.Servicios[0].descripcion}</Text>
                                        <Text mt='8px'><strong>Monto:</strong> $ {registro.Servicios[0].monto}</Text>
                                        <Box mt='5px' display='flex' >
                                            <Text fontSize="md" fontWeight="bold">Pago Realizado:</Text>
                                            {isEditing ? (
                                                <Box display='flex' columnGap='5px'>
                                                    <Input 
                                                        type="number" 
                                                        value={pago} 
                                                        onChange={handleChangePago} 
                                                        placeholder="Introduce el monto"
                                                        w='30%'
                                                        ml='10px'
                                                    />
                                                    <Flex
                                                        flexDir='column'
                                                        >
                                                        <Text as='button' onClick={() => handleSavePago(registro.id)} color="blue" size="sm">
                                                            Guardar
                                                        </Text>
                                                        <Text as='button' onClick={() => setIsEditing(false)} color="red" size="sm">
                                                            Cancelar
                                                        </Text>
                                                    </Flex>
                                                </Box>
                                            ) : (
                                                <Box display='flex' columnGap='10px'>
                                                    <Text ml='8px' fontSize="md">${pago}</Text>
                                                    <Text as='button' onClick={() => setIsEditing(true)} color='red' _hover={{transform: 'scale(1.1)'}}>
                                                        Editar
                                                    </Text>
                                                </Box>
                                            )}
                                        </Box>
                                        <Text mt='8px'><strong>Proximo Servicio:</strong>
                                            {
                                                (registro.Servicios[0].proximoServicio).length > 0 ? 
                                                parseInt(registro.Servicios[0].proximoServicio, 10) === 0 ? ' Realizar Proximo Servicio' : ` ${registro.Servicios[0].proximoServicio} Días` 
                                                : ' -'
                                            }
                                        </Text>
                                        <Text mt='8px'><strong>Desc. Prox. Servicio:</strong> {registro.Servicios[0].descripcionProximoServicio ? registro.Servicios[0].descripcionProximoServicio : ' -'}</Text>
                                        <Text mt='8px'><strong>Fecha de Entrega:</strong> {formatDate((registro.Servicios[0].fechaEntrega).slice(0, 10))}</Text>
                                        <Flex
                                            mt='20px'
                                            justify='center'
                                            columnGap='30px'
                                            rowGap='20px'
                                            flexDir={['column', 'row', 'row']}
                                            >
                                            <Text
                                                fontWeight='bold'
                                                as='button'
                                                _hover={{
                                                    transform: 'scale(1.1)'
                                                }}
                                                onClick={() => handleClienteClick(registro)}
                                                textTransform='capitalize'
                                                >
                                                Datos Personales
                                            </Text>
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
                                        </Flex>
                                    </AccordionPanel>
                                </Box>
                                )}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Flex>
                )}
            </Flex>
            { clienteSeleccionado && (
                <ClienteModal isOpen={isOpen} onClose={onClose} clienteSeleccionado={clienteSeleccionado} />
            )}
        </Box>
    );
};

export default RegistroCompleto;
