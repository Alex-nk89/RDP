import { useWindowScroll } from '@mantine/hooks';
import { ActionIcon, Affix, Transition } from '@mantine/core';
import { BsArrowUpSquareFill } from 'react-icons/bs';

export const ScrollToTop = () => {
    const [scroll, scrollTo] = useWindowScroll();

    return (
        <>
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <ActionIcon color="blue" style={transitionStyles} onClick={() => scrollTo({ y: 0 })}>
                            <BsArrowUpSquareFill size={26}/>
                        </ActionIcon>
                    )}
                </Transition>
            </Affix>
        </>
    )
}