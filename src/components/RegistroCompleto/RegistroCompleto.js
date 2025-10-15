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
import DatosServicioModal from './DatosServicioModal';
import { Link } from 'react-router-dom';
import casco from '../../img/casco.png'
import moto from '../../img/moto.png'
import mecanico from '../../img/mecanico.png'
import fondo from '../../img/fondo.jpg'
import pagado from '../../img/pagado.png'
import deuda from '../../img/nopago.png'


const RegistroCompleto = ({apiRender}) => {
    const [registros, setRegistros] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [filtrados, setFiltrados] = useState([]);
    const [verUltimos30Dias, setVerUltimos30Dias] = useState(false);
    const [ordenProximoServicio, setOrdenProximoServicio] = useState(false);
    const [busqueda, setBusqueda] = useState('')
    const [filtrarPorDeuda, setFiltrarPorDeuda] = useState(false);
    const [mesSeleccionado, setMesSeleccionado] = useState('')
    const [añoSeleccionado, setAñoSeleccionado] = useState('')
    const [pago, setPago] = useState(0);
    const [montoManoObra, setManoObra] = useState(0);
    const [montoRepuesto, setRepuestoMonto] = useState(0); 
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingManoObra, setIsEditingManoObra] = useState(false);
    const [isEditingRepuestos, setIsEditingRepuestos] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ isDatosServicioModalOpen, setIsDatosServicioModalOpen ] = useState(false);
    const [ clienteSeleccionadoServicio, setClienteSeleccionadoServicio ] = useState(null);

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

    // funcion para refrescar los usuarios
    const fetchUsuarios = async () => {
        setTimeout(() => {
            window.location.reload()
        }, 1000);
    };

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

    //Funcion para seleccionar el mes
    const handleMesChange = (e) => {
        setMesSeleccionado(e.target.value)
    }

     //Funcion para seleccionar el año
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
        const mes = fechaEntrega.getMonth() + 1;
        const año = fechaEntrega.getFullYear();
        return (
            (!mesSeleccionado || mes === parseInt(mesSeleccionado, 10)) &&
            (!añoSeleccionado || año === parseInt(añoSeleccionado, 10))
        );
    })
    .filter((registro) => {
        if (!filtrarPorDeuda) return true; // Si no está activado, no filtra por deuda
        return registro.Servicios.some((servicio) => servicio.deuda > 1);
    })
    .sort((a, b) => {
        if (!filtrarPorDeuda) return 0; // No ordena si el filtro no está activo
        const deudaA = Math.max(...a.Servicios.map((servicio) => servicio.deuda));
        const deudaB = Math.max(...b.Servicios.map((servicio) => servicio.deuda));
        return deudaB - deudaA;
    });


    // Formato de fecha DD-MM-YYYY
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

    const handleChangePago = (e) => {
        setPago(e.target.value); 
    };

    const handleChangeManoObra = (e) => {
        setManoObra(e.target.value); 
    };

    const handleChangeRepuestoMonto = (e) => {
        setRepuestoMonto(e.target.value); 
    };

    const handleSavePago = async (id) => {
        try {
            // Enviar la actualización al backend
            await axios.put(`${apiRender}/api/updateservicio/${id}`, { pago });
            toast({
                title: 'Exito',
                description: 'Pago actualizado con exito',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            fetchUsuarios()
            setIsEditing(false);
        } catch (error) {
            // Manejo de errores
            console.error('Error al actualizar el pago', error);
            toast({
                title: 'Error',
                description: 'Hubo un error al actualizar el pago',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    }; 
    
    const handleSaveManoObra = async (id) => {
        try {
            // Enviar la actualización al backend
            await axios.put(`${apiRender}/api/updatemontomanoobra/${id}`, { montoManoObra });
            toast({
                title: 'Exito',
                description: 'Pago actualizado con exito',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            fetchUsuarios()
            setIsEditingManoObra(false);
        } catch (error) {
            // Manejo de errores
            console.error('Error al actualizar el pago', error);
            toast({
                title: 'Error',
                description: 'Hubo un error al actualizar el pago',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    };
    
    const handleSaveRepuestoMonto = async (id) => {
        try {
            // Enviar la actualización al backend
            await axios.put(`${apiRender}/api/updatemontorepuesto/${id}`, { montoRepuesto });
            toast({
                title: 'Exito',
                description: 'Pago actualizado con exito',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            fetchUsuarios()
            setIsEditingRepuestos(false);
        } catch (error) {
            // Manejo de errores
            console.error('Error al actualizar el pago', error);
            toast({
                title: 'Error',
                description: 'Hubo un error al actualizar el pago',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    };
    
    // Funcion para ficha tecnica de servicios
    const handleDatosServicioClick = (cliente) => {
        setClienteSeleccionadoServicio(cliente);
        setIsDatosServicioModalOpen(true);
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
                    {Array.from({ length: 3 }, (_, i) => {
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
                <Button
                    colorScheme={filtrarPorDeuda ? "red" : "teal"}
                    color='black'
                    onClick={() => setFiltrarPorDeuda((prev) => !prev)}
                    mb={4}
                >
                    {filtrarPorDeuda ? "Mostrar Todos" : "Filtrar por Deuda"}
                </Button>
                <Flex>
                    <MontoModal registrosFiltrados={registrosFiltrados} />
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
                                mt='40px'
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
                                            <Text fontWeight="bold" textAlign='start' fontSize='lg'>{registro.nombre}</Text>
                                        </Flex>

                                        <Flex
                                            columnGap='10px'
                                            >
                                            <Image src={moto} alt='moto' w='25px' h='25px'/>
                                            <Text fontWeight="bold" textAlign='start'>{registro.Motos[0].marca} {registro.Motos[0].modelo}</Text>
                                        </Flex>

                                        <Flex
                                            columnGap='10px'
                                            >
                                            <Image src={mecanico} alt='proximoservicio' w='25px' h='25px'/>
                                            <Text textAlign='start'><strong>Proximo Servicio:</strong>
                                                {
                                                    (registro.Servicios[0].proximoServicio).length > 0 ? 
                                                    parseInt(registro.Servicios[0].proximoServicio, 10) === -1 ? ' Realizar Proximo Servicio' : ` ${registro.Servicios[0].proximoServicio} Días` 
                                                    : ' No hay proximo servicio'
                                                }
                                            </Text>                                        
                                        </Flex>

                                        <Flex
                                            columnGap='10px'
                                            >
                                            <Image src={registro.Servicios[0].deuda === 0 ? pagado : deuda} alt='moto' w='25px' h='25px'/>
                                            <Text fontWeight="bold" textAlign='center'>{registro.Servicios[0].deuda === 0 ? 'Cliente al Dia' : 'Deuda: $' + registro.Servicios[0].deuda}</Text>
                                        </Flex>
                                    </Box>
                                    </AccordionButton>
                                    <AccordionPanel pb={4} textAlign='start'>
                                        <Text mt='8px'><strong>KM:</strong> {registro.Motos[0].km ? `${registro.Motos[0].km} KMS` : '-'}</Text>
                                        <Text mt='8px'><strong>Servicio:</strong> {registro.Servicios[0].descripcion}</Text>
                                        <Box
                                            display='flex'
                                            mt='5px'
                                            >
                                        <Text fontSize="md" fontWeight="bold" alignSelf='center' mr='5px'>Monto de Mano de Obra:</Text>
                                        {isEditingManoObra ? (
                                                <Box
                                                    display='flex'
                                                    flexDir={['column','row','row']}
                                                    columnGap='10px'
                                                    >
                                                    <Input
                                                        alignSelf='center'
                                                        type="number" 
                                                        value={montoManoObra} 
                                                        onChange={handleChangeManoObra} 
                                                        placeholder="Introduce el monto"
                                                        size="md"
                                                        w='100%'
                                                        ml='8px'
                                                    />
                                                    <Flex
                                                        flexDir='row'
                                                        columnGap={['5px','10px','10px']}
                                                        justifyContent='center'
                                                        >
                                                        <Text
                                                            as='button'
                                                            onClick={() => handleSaveManoObra(registro.Servicios[0].clienteId)} 
                                                            size="sm"
                                                            _hover={{
                                                                transform: 'scale(1.1)'
                                                            }}
                                                            fontWeight='bold'
                                                            color='blue'
                                                            >
                                                            Guardar
                                                        </Text>
                                                        <Text 
                                                            onClick={() => setIsEditingManoObra(false)}
                                                            as='button'
                                                            size="sm"
                                                            _hover={{
                                                                transform: 'scale(1.1)'
                                                            }}
                                                            fontWeight='bold'
                                                            color='red'
                                                            >
                                                            Cancelar
                                                        </Text>
                                                    </Flex>
                                                </Box>
                                            ) : (
                                                <Box
                                                    display='flex'
                                                    columnGap='10px'
                                                    >
                                                    <Text ml='8px' alignSelf='center' fontSize="md" >${(registro.Servicios[0].montoManoObra).toLocaleString("es-AR")}</Text>
                                                    <Text   
                                                        as='button' 
                                                        onClick={() => setIsEditingManoObra(true)} 
                                                        size="sm"
                                                        _hover={{
                                                            transform: 'scale(1.1)'
                                                        }}
                                                        color='red'
                                                        fontWeight='bold'
                                                        >
                                                        Editar
                                                    </Text>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box
                                            display='flex'
                                            mt='5px'
                                            >
                                            <Text fontSize="md" fontWeight="bold" alignSelf='center' mr='5px'>Monto de Repuestos:</Text>
                                            {isEditingRepuestos ? (
                                                    <Box
                                                        display='flex'
                                                        flexDir={['column','row','row']}
                                                        columnGap='10px'
                                                        >
                                                        <Input
                                                            alignSelf='center'
                                                            type="number" 
                                                            value={montoRepuesto} 
                                                            onChange={handleChangeRepuestoMonto} 
                                                            placeholder="Introduce el monto"
                                                            size="md"
                                                            w='100%'
                                                            ml='8px'
                                                        />
                                                        <Flex
                                                            flexDir='row'
                                                            columnGap={['5px','10px','10px']}
                                                            justifyContent='center'
                                                            >
                                                            <Text
                                                                as='button'
                                                                onClick={() => handleSaveRepuestoMonto(registro.Servicios[0].clienteId)} 
                                                                size="sm"
                                                                _hover={{
                                                                    transform: 'scale(1.1)'
                                                                }}
                                                                fontWeight='bold'
                                                                color='blue'
                                                                >
                                                                Guardar
                                                            </Text>
                                                            <Text 
                                                                onClick={() => setIsEditingRepuestos(false)}
                                                                as='button'
                                                                size="sm"
                                                                _hover={{
                                                                    transform: 'scale(1.1)'
                                                                }}
                                                                fontWeight='bold'
                                                                color='red'
                                                                >
                                                                Cancelar
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        display='flex'
                                                        columnGap='10px'
                                                        >
                                                        <Text ml='8px' alignSelf='center' fontSize="md" >${(registro.Servicios[0].montoRepuesto).toLocaleString("es-AR")}</Text>
                                                        <Text   
                                                            as='button' 
                                                            onClick={() => setIsEditingRepuestos(true)} 
                                                            size="sm"
                                                            _hover={{
                                                                transform: 'scale(1.1)'
                                                            }}
                                                            color='red'
                                                            fontWeight='bold'
                                                            >
                                                            Editar
                                                        </Text>
                                                    </Box>
                                                )}
                                        </Box>
                                        <Text mt='8px'><strong>Monto Total:</strong> ${registro.Servicios[0].monto}</Text>
                                        <Box
                                            display='flex'
                                            mt='6px'
                                            >
                                            <Text fontSize="md" fontWeight="bold" alignSelf='center' mr='5px'>Pago Realizado:</Text>
                                            {isEditing ? (
                                                <Box
                                                    display='flex'
                                                    flexDir={['column','row','row']}
                                                    columnGap='10px'
                                                    >
                                                    <Input
                                                        alignSelf='center'
                                                        type="number" 
                                                        value={pago} 
                                                        onChange={handleChangePago} 
                                                        placeholder="Introduce el monto"
                                                        size="md"
                                                        w='100%'
                                                        ml='8px'
                                                    />
                                                    <Flex
                                                        flexDir='row'
                                                        columnGap={['5px','10px','10px']}
                                                        justifyContent='center'
                                                        >
                                                        <Text
                                                            as='button'
                                                            onClick={() => handleSavePago(registro.Servicios[0].clienteId)} 
                                                            size="sm"
                                                            _hover={{
                                                                transform: 'scale(1.1)'
                                                            }}
                                                            fontWeight='bold'
                                                            color='blue'
                                                            >
                                                            Guardar
                                                        </Text>
                                                        <Text 
                                                            onClick={() => setIsEditing(false)}
                                                            as='button'
                                                            size="sm"
                                                            _hover={{
                                                                transform: 'scale(1.1)'
                                                            }}
                                                            fontWeight='bold'
                                                            color='red'
                                                            >
                                                            Cancelar
                                                        </Text>
                                                    </Flex>
                                                </Box>
                                            ) : (
                                                <Box
                                                    display='flex'
                                                    columnGap='10px'
                                                    >
                                                    <Text ml='8px' alignSelf='center' fontSize="md" >${registro.Servicios[0].pago.toLocaleString("es-AR")}</Text>
                                                    <Text   
                                                        as='button' 
                                                        onClick={() => setIsEditing(true)} 
                                                        size="sm"
                                                        _hover={{
                                                            transform: 'scale(1.1)'
                                                        }}
                                                        color='red'
                                                        fontWeight='bold'
                                                        >
                                                        Editar
                                                    </Text>
                                                </Box>
                                            )}
                                        </Box>
                                        <Text mt='8px'><strong>Proximo Servicio:</strong>
                                            {
                                                (registro.Servicios[0].proximoServicio).length > 0 ? 
                                                parseInt(registro.Servicios[0].proximoServicio, 10) === -1 ? ' Realizar Proximo Servicio' : ` ${registro.Servicios[0].proximoServicio} Días` 
                                                : ' -'
                                            }
                                        </Text>
                                        <Text mt='8px'><strong>KM para Prox. Serv.:</strong> {registro.Servicios[0].kmProximoServicio ? `${registro.Servicios[0].kmProximoServicio} KMS` : 'No hay datos'}</Text>
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
                                                colorScheme='green'
                                                color='black'
                                                onClick={() => handleDatosServicioClick(registro)}
                                            >
                                                Ficha Tecnica
                                            </Button>
                                            <Button
                                                fontSize='sm'
                                                colorScheme='red'
                                                color='black'
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
            {clienteSeleccionadoServicio && (
                <DatosServicioModal
                    isOpen={isDatosServicioModalOpen}
                    onClose={() => setIsDatosServicioModalOpen(false)}
                    clienteId={clienteSeleccionadoServicio.id}
                    clienteNombre={clienteSeleccionadoServicio.nombre}
                    apiRender={apiRender}
                />
            )}
        </Box>
    );
};

export default RegistroCompleto;
