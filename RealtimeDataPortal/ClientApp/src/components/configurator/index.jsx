import { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { useNotification } from "../../hooks/useNotification";
import { useForm } from '@mantine/hooks';
import {
    TextInput, Space, Button, MultiSelect, ActionIcon, Tabs, Select, Loader, Checkbox, Text, Group,
    InputWrapper, Divider, NumberInput
} from '@mantine/core';
import { useModals } from '@mantine/modals';

import { BsSearch, BsDash, BsPlus, BsX } from 'react-icons/bs';

import { useRequest } from "../../hooks/useRequest";
import ErrorsPage from '../errors-page/ErrorsPage';
import AppPreloader from "../loader/appPreloader";
import Tag from './forms/tag/Tag';
import AddChangeTag from './forms/tag/AddChangeTag';
import DeleteElements from '../delete-elements/DeleteElements';
import Product from './forms/product/Product';
import AddChangeProduct from './forms/product/AddChangeProduct';
import Parameter from './forms/product/Parameter';
import ParameterTag from './forms/product/ParameterTag';
import AddChangeElement from './forms/add-change-element/AddChangeElement';
import AddChangeFolder from './forms/folder/AddChangeFolder';
import AddChangeExternalPage from './forms/external-page/CreateExternalPage';
import AddChangeGraphic from './forms/graphic/AddChangeGraphic';
import AddChangeTableRT from './forms/table-rt/AddChangeTableRT';
import InstructionForConfigurator from './instruction-for-configurator/InstructionForConfigurator';
import Section from './forms/table-rt/Section';
import SectionProducts from './forms/table-rt/SectionProducts';
import { EditMnemoscheme } from './forms/mnemoscheme/EditMnemoscheme'

const attributesInputs = {
    required: true,
    autoComplete: 'off'
};

const settingsAddRemoveIcon = {
    size:'xs',
    variant:'light'
};

export {
    useEffect, useState, useParams, useRequest, useNotification, useRef, 
    useSelector, useDispatch, createSelector,
    AddChangeFolder, AppPreloader, ErrorsPage, AddChangeExternalPage, Tag, AddChangeTag, DeleteElements, Product, AddChangeProduct,
    Parameter, ParameterTag, AddChangeElement, AddChangeGraphic, AddChangeTableRT, InstructionForConfigurator, 
    Section, SectionProducts, EditMnemoscheme,
    attributesInputs, settingsAddRemoveIcon,
    TextInput, Space, Button, useForm, MultiSelect, ActionIcon, Tabs, Select, Loader, Checkbox, useModals, Text, Group,
    InputWrapper, Divider, NumberInput,
    BsPlus, BsDash, BsX, BsSearch
};