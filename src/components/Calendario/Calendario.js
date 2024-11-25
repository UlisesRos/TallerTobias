import { Box, Button, Flex, Text, VStack, Image, useToast } from '@chakra-ui/react';
import logo from '../../img/motor.png'
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { format, startOfWeek, addDays, subDays, isSameDay } from "date-fns";
import { es } from 'date-fns/locale'
import axios from 'axios';
import ModalTurno from './ModalTurno';

const apiRender = 'https://tallertobiasbackend.onrender.com' || 'http://localhost:5000'

function Calendario() {
    const [ currentDate, setCurrentDate ] = useState(new Date());
    const [ turnos, setTurnos ] = useState([]);

    const toast = useToast()

    // Obtener Lunes de la semana actual
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

    // Avanzar a la semana siguiente
    const handleNextWeek = () => {
        setCurrentDate(addDays(currentDate, 7))
    };

    // Regresar a la semana anterior
    const handlePreviousWeek = () => {
        setCurrentDate(subDays(currentDate, 7))
    };

    // Crear los dias de la semana
    const daysOfWeek = Array.from({ length: 7 }, (_, index) => 
        addDays(startOfCurrentWeek, index)
    );

    useEffect(() => {
        const fetchTurnos = async() => {
            try {
                const response = await axios.get(`${apiRender}/getturnos`)
                setTurnos(response.data)
            } catch (error) {
                console.error('Error al obtener los turnos', error)
            }
        };

        fetchTurnos()
    }, [])

    const handleDeleteTurno = async (id) => {
        try {
            await axios.delete(`${apiRender}/turnos/${id}`); // Backend API
            toast({
                title: 'Exito',
                description: 'Turno eliminado con exito',
                status: 'success',
                duration: 5000,
                isClosable: true
            })
            setTurnos((prev) => prev.filter((turno) => turno.id !== id));
        } catch (error) {
            console.error('Error al eliminar el turno:', error);
            toast({
                title: 'Error',
                description: 'Error al eliminar el turno',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
        }
    };

    return (
        <Box
            p={4}
            >
            <Flex
                justifyContent='space-between'
                alignItems='center'
                mt='20px'
                mb={['50px','30px','30px']}
                ml='10px'
                mr='10px'
                >
                <Image bgColor='black' borderRadius='100px' src={logo} alt='logo del taller' w='90px' h='90px' padding='4px'/>
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
            </Flex>
            <Box
                display='flex'
                justifyContent='space-between'
                mb={4}
                >
                <Button
                    display={['block', 'none', 'none']}
                    bg='primario.1'
                    color='secundario.2'
                    boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                    transition="box-shadow 0.3s ease"
                    _hover={{
                        color: 'white',
                        border: 'solid 1px black',
                        boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                    }}
                    onClick={handlePreviousWeek}
                    >
                    ⏪
                </Button>
                <Button
                    isTruncated
                    display={['none','block', 'block']}
                    bg='primario.1'
                    color='secundario.2'
                    boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                    transition="box-shadow 0.3s ease"
                    _hover={{
                        color: 'white',
                        border: 'solid 1px black',
                        boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                    }}
                    onClick={handleNextWeek}
                    >
                    Semana Anterior
                </Button>
                <Text
                    w='auto'
                    textAlign='center'
                    fontWeight='bold'
                    fontSize={['md','lg','lg']}
                    >
                    {format(daysOfWeek[0], "dd MMM yyyy", {locale: es})} -{" "}
                    {format(daysOfWeek[6], "dd MMM yyyy", {locale: es})}
                </Text>
                <Button
                    display={['block', 'none', 'none']}
                    bg='primario.1'
                    color='secundario.2'
                    boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                    transition="box-shadow 0.3s ease"
                    _hover={{
                        color: 'white',
                        border: 'solid 1px black',
                        boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                    }}
                    onClick={handleNextWeek}
                    >
                    ⏩
                </Button>
                <Button
                    isTruncated
                    display={['none','block', 'block']}
                    bg='primario.1'
                    color='secundario.2'
                    boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                    transition="box-shadow 0.3s ease"
                    _hover={{
                        color: 'white',
                        border: 'solid 1px black',
                        boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                    }}
                    onClick={handleNextWeek}
                    >
                    Proxima Semana
                </Button>
            </Box>
            
            <Flex
                flexDir='column'
                rowGap='20px'
                alignItems='center'
                >
                {daysOfWeek.map((day) => {
                    const turnosDelDia = turnos.filter(
                        (turno) => new Date(turno.fecha).toDateString() === day.toDateString()
                    )

                    return (
                        <VStack
                            mt='10px'
                            w={['95%','85%','80%']}
                            boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                            transition="box-shadow 0.3s ease"
                            _hover={{
                                boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                            }}  
                            key={day}
                            p={4}
                            borderWidth='1px'
                            borderRadius='md'
                            alignItems='center'
                            bg={isSameDay(day, new Date()) ? '#E0E0E0' : 'white'}
                            >
                            <Text
                                fontWeight='bold'
                                textTransform='capitalize'
                                fontSize='lg'
                                >
                                {format(day, "EEEE", {locale: es})}
                            </Text>
                            <Text
                                fontSize='lg'
                                >
                                {format(day, "dd/MM")}
                            </Text>
                            {turnosDelDia.map((turno) => (
                                <Flex
                                    flexDir='column'
                                    align='center'
                                    boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                                    transition="box-shadow 0.3s ease"
                                    _hover={{
                                        boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                                    }}  
                                    key={turno.id}
                                    mt='10px'
                                    padding='10px 10px 10px 15px' 
                                    bg="#A5D6A7"
                                    borderRadius='md'
                                    w={['95%','70%',"50%"]}
                                    textAlign='center'
                                    >
                                    <Text fontWeight="bold">{turno.nombre}</Text>
                                    <Text><Text as='span' textDecor='underline'>Moto</Text>: {turno.moto}</Text>
                                    <Text><Text as='span' textDecor='underline'>Servicio</Text>: {turno.descripcion}</Text>
                                    <Flex
                                        alignItems='center'
                                        justifyContent='center'
                                        w='100%'
                                        >
                                        <Button
                                            mt='10px'
                                            size='sm'
                                            bg='primario.1'
                                            color='secundario.2'
                                            boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                                            transition="box-shadow 0.3s ease"
                                            _hover={{
                                                color: 'white',
                                                border: 'solid 1px black',
                                                boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                                            }}
                                            onClick={() => handleDeleteTurno(turno.id)}
                                            >
                                            Eliminar
                                        </Button>
                                    </Flex>
                                </Flex>
                            ))}

                            <ModalTurno selectedDate={day}/>
                        </VStack>
                    )
                    })}
            </Flex>
        </Box>
    )
}

export default Calendario