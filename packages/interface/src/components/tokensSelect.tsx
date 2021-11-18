import { Fragment } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { Token } from "../utils/data/Token";
// import type { Token } from "../slices/droidForm"

declare interface TokensDropDownProps {
  tokens: Token[];
  selected: Token;
  onSelect: (t: Token) => void;
  input: () => JSX.Element;
  hasSelected: boolean;
  className: string;
  label: string;
  labelClassName: string;
}

export const TokensDropdown = (props: TokensDropDownProps) => {
  const { tokens = [], selected, onSelect, hasSelected } = props;
  const bySymbolAndName = (t: Token) => {
    if (hasSelected) {
      return false;
    }
    if (selected && selected.name && (t.symbol || t.name)) {
      const valReg = new RegExp(selected.name.toLowerCase());
      if (
        valReg.test(t.symbol.toLocaleLowerCase()) ||
        valReg.test(t.name.toLocaleLowerCase())
      ) {
        return true;
      }
    }
    return false;
  };

  const filteredTokens = tokens.filter(bySymbolAndName);

  return (
    <div className={`z-50 ${props.className} w-full`}>
      <Listbox value={selected || {}} onChange={onSelect}>
        <div
          className={`relative mt-1 w-full flex flex-row justify-between ${
            filteredTokens && filteredTokens.length > 0 ? "" : "items-center"
          }`}
        >
          <div className={`mr-1 ${props.labelClassName}`}>
            <label>{props.label}</label>
          </div>
          <div>
            {props.input()}
            {filteredTokens.map((t) => {
              return (
                <Listbox.Option key={t.name} value={t} as={Fragment}>
                  {({ active, selected }) => (
                    <li
                      className={`${
                        active
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {selected && <CheckIcon />}
                      {t.name}
                    </li>
                  )}
                </Listbox.Option>
              );
            })}
          </div>
        </div>
      </Listbox>
    </div>
  );
};
