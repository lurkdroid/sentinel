import { Dialog, Transition } from '@headlessui/react';

export const MessageDialog = (props: { show: boolean }) => {
  const { show } = props;

  console.log({ show });

  return (
    <Transition
      show={show}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        open={show}
        onClose={() => {}}
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto flex flex-col justify-center items-center text-black"
      >
        <div
          className={`
        inline-block w-full max-w-md p-6 my-8 overflow-hidden
         text-left align-middle transition-all transform 
         bg-white shadow-xl rounded-2xl`}
        >
          <Dialog.Overlay className="fixed inset-0" />

          <Dialog.Title className="font-bold text-center text-lg">
            NETWORK IS NOT SUPPORTED
          </Dialog.Title>
          <Dialog.Description>
            WE SUPPORT THE FOLLLOWING NETWORKS:
            <br />
            - kovan
            <br />
            - avax mainnet
            <br />
            - harmony
            <br />
            - binance smart chain
            <br />
            - polygon
            <br />
          </Dialog.Description>

          {/* <button onClick={() => setIsOpen(false)}>Deactivate</button> */}
          {/* <button onClick={() => setIsOpen(false)}>Cancel</button> */}
        </div>
      </Dialog>
    </Transition>
  );
};
