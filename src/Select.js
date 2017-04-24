/*!
 Copyright (c) 2016 Jed Watson.
 Licensed under the MIT License (MIT), see
 http://jedwatson.github.io/react-select
 */

import React from 'react';
import AutosizeInput from 'react-input-autosize';
import classNames from 'classnames';

import defaultArrowRenderer from './utils/defaultArrowRenderer';
import defaultFilterOptions from './utils/defaultFilterOptions';
import defaultMenuRenderer from './utils/defaultMenuRenderer';
import defaultClearRenderer from './utils/defaultClearRenderer';

import selectControl from './selectControl';
import Async from './Async';
import AsyncCreatable from './AsyncCreatable';
import Creatable from './Creatable';
import Option from './Option';
import Value from './Value';


const stringOrNode = React.PropTypes.oneOfType([
	React.PropTypes.string,
	React.PropTypes.node
]);

const Select = React.createClass({

	displayName: 'Select',

	propTypes: {
		addLabelText: React.PropTypes.string,       // placeholder displayed when you want to add a label on a multi-value input
		'aria-describedby': React.PropTypes.string,	// HTML ID(s) of element(s) that should be used to describe this input (for assistive tech)
		'aria-label': React.PropTypes.string,       // Aria label (for assistive tech)
		'aria-labelledby': React.PropTypes.string,	// HTML ID of an element that should be used as the label (for assistive tech)
		arrowRenderer: React.PropTypes.func,				// Create drop-down caret element
		autoBlur: React.PropTypes.bool,             // automatically blur the component when an option is selected
		autofocus: React.PropTypes.bool,            // autofocus the component on mount
		autosize: React.PropTypes.bool,             // whether to enable autosizing or not
		backspaceRemoves: React.PropTypes.bool,     // whether backspace removes an item if there is no text input
		backspaceToRemoveMessage: React.PropTypes.string,  // Message to use for screenreaders to press backspace to remove the current item - {label} is replaced with the item label
		className: React.PropTypes.string,          // className for the outer element
		clearAllText: stringOrNode,                 // title for the "clear" control when multi: true
		clearRenderer: React.PropTypes.func,        // create clearable x element
		clearValueText: stringOrNode,               // title for the "clear" control
		clearable: React.PropTypes.bool,            // should it be possible to reset value
		deleteRemoves: React.PropTypes.bool,        // whether backspace removes an item if there is no text input
		delimiter: React.PropTypes.string,          // delimiter to use to join multiple values for the hidden field value
		disabled: React.PropTypes.bool,             // whether the Select is disabled or not
		escapeClearsValue: React.PropTypes.bool,    // whether escape clears the value when the menu is closed
		filterOption: React.PropTypes.func,         // method to filter a single option (option, filterString)
		filterOptions: React.PropTypes.any,         // boolean to enable default filtering or function to filter the options array ([options], filterString, [values])
		ignoreAccents: React.PropTypes.bool,        // whether to strip diacritics when filtering
		ignoreCase: React.PropTypes.bool,           // whether to perform case-insensitive filtering
		inputProps: React.PropTypes.object,         // custom attributes for the Input
		inputRenderer: React.PropTypes.func,        // returns a custom input component
		instanceId: React.PropTypes.string,         // set the components instanceId
		isLoading: React.PropTypes.bool,            // whether the Select is loading externally or not (such as options being loaded)
		joinValues: React.PropTypes.bool,           // joins multiple values into a single form field with the delimiter (legacy mode)
		labelKey: React.PropTypes.string,           // path of the label value in option objects
		matchPos: React.PropTypes.string,           // (any|start) match the start or entire string when filtering
		matchProp: React.PropTypes.string,          // (any|label|value) which option property to filter on
		menuBuffer: React.PropTypes.number,         // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
		menuContainerStyle: React.PropTypes.object, // optional style to apply to the menu container
		menuRenderer: React.PropTypes.func,         // renders a custom menu with options
		menuStyle: React.PropTypes.object,          // optional style to apply to the menu
		multi: React.PropTypes.bool,                // multi-value input
		name: React.PropTypes.string,               // generates a hidden <input /> tag with this field name for html forms
		noResultsText: stringOrNode,                // placeholder displayed when there are no matching search results
		onBlur: React.PropTypes.func,               // onBlur handler: function (event) {}
		onBlurResetsInput: React.PropTypes.bool,    // whether input is cleared on blur
		onChange: React.PropTypes.func,             // onChange handler: function (newValue) {}
		onClose: React.PropTypes.func,              // fires when the menu is closed
		onCloseResetsInput: React.PropTypes.bool,		// whether input is cleared when menu is closed through the arrow
		onFocus: React.PropTypes.func,              // onFocus handler: function (event) {}
		onInputChange: React.PropTypes.func,        // onInputChange handler: function (inputValue) {}
		onInputKeyDown: React.PropTypes.func,       // input keyDown handler: function (event) {}
		onMenuScrollToBottom: React.PropTypes.func, // fires when the menu is scrolled to the bottom; can be used to paginate options
		onOpen: React.PropTypes.func,               // fires when the menu is opened
		onValueClick: React.PropTypes.func,         // onClick handler for value labels: function (value, event) {}
		openAfterFocus: React.PropTypes.bool,       // boolean to enable opening dropdown when focused
		openOnFocus: React.PropTypes.bool,          // always open options menu on focus
		optionClassName: React.PropTypes.string,    // additional class(es) to apply to the <Option /> elements
		optionComponent: React.PropTypes.func,      // option component to render in dropdown
		optionRenderer: React.PropTypes.func,       // optionRenderer: function (option) {}
		options: React.PropTypes.array,             // array of options
		pageSize: React.PropTypes.number,           // number of entries to page when using page up/down keys
		placeholder: stringOrNode,                  // field placeholder, displayed when there's no value
		required: React.PropTypes.bool,             // applies HTML5 required attribute when needed
		resetValue: React.PropTypes.any,            // value to use when you clear the control
		scrollMenuIntoView: React.PropTypes.bool,   // boolean to enable the viewport to shift so that the full menu fully visible when engaged
		searchable: React.PropTypes.bool,           // whether to enable searching feature or not
		simpleValue: React.PropTypes.bool,          // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
		style: React.PropTypes.object,              // optional style to apply to the control
		tabIndex: React.PropTypes.string,           // optional tab index of the control
		tabSelectsValue: React.PropTypes.bool,      // whether to treat tabbing out while focused to be value selection
		value: React.PropTypes.any,                 // initial field value
		valueComponent: React.PropTypes.func,       // value component to render
		valueKey: React.PropTypes.string,           // path of the label value in option objects
		valueRenderer: React.PropTypes.func,        // valueRenderer: function (option) {}
		wrapperStyle: React.PropTypes.object,       // optional style to apply to the component wrapper
	},

	statics: {Async, AsyncCreatable, Creatable},

	getDefaultProps () {
		return {
			addLabelText: 'Add "{label}"?',
			arrowRenderer: defaultArrowRenderer,
			autosize: true,
			backspaceRemoves: true,
			backspaceToRemoveMessage: 'Press backspace to remove {label}',
			clearable: true,
			clearAllText: 'Clear all',
			clearRenderer: defaultClearRenderer,
			clearValueText: 'Clear value',
			deleteRemoves: true,
			delimiter: ',',
			disabled: false,
			escapeClearsValue: true,
			filterOptions: defaultFilterOptions,
			ignoreAccents: true,
			ignoreCase: true,
			inputProps: {},
			isLoading: false,
			joinValues: false,
			labelKey: 'label',
			matchPos: 'any',
			matchProp: 'any',
			menuBuffer: 0,
			menuRenderer: defaultMenuRenderer,
			multi: false,
			noResultsText: 'No results found',
			onBlurResetsInput: true,
			onCloseResetsInput: true,
			openAfterFocus: false,
			optionComponent: Option,
			pageSize: 5,
			placeholder: 'Select...',
			required: false,
			scrollMenuIntoView: true,
			searchable: true,
			simpleValue: false,
			tabSelectsValue: true,
			valueComponent: Value,
			valueKey: 'value',
		};
	},

	renderLoading () {
		if (!this.props.isLoading) return;
		return (
			<span className="Select-loading-zone" aria-hidden="true">
				<span className="Select-loading"/>
			</span>
		);
	},

	renderValue (valueArray, isOpen) {
		let renderLabel = this.props.valueRenderer || this.props.getOptionLabel;
		let ValueComponent = this.props.valueComponent;
		if (!valueArray.length) {
			return !this.props.inputValue ?
				<div className="Select-placeholder">{this.props.placeholder}</div> : null;
		}
		let onClick = this.props.onValueClick ? this.props.handleValueClick : null;
		if (this.props.multi) {
			return valueArray.map((value, i) => {
				return (
					<ValueComponent
						id={this.props.getId('value', i)}
						instancePrefix={this.props.getId()}
						disabled={this.props.disabled || value.clearableValue === false}
						key={`value-${i}-${value[this.props.valueKey]}`}
						onClick={onClick}
						onRemove={this.props.removeValue}
						value={value}
					>
						{renderLabel(value, i)}
						<span className="Select-aria-only">&nbsp;</span>
					</ValueComponent>
				);
			});
		} else if (!this.props.inputValue) {
			if (isOpen) onClick = null;
			return (
				<ValueComponent
					id={this.props.getId('value-item')}
					disabled={this.props.disabled}
					instancePrefix={this.props.getId()}
					onClick={onClick}
					value={valueArray[0]}
				>
					{renderLabel(valueArray[0])}
				</ValueComponent>
			);
		}
	},

	renderInput (valueArray, focusedOptionIndex) {
		let className = classNames('Select-input', this.props.inputProps.className);
		const isOpen = !!this.props.isOpen;

		const ariaOwns = classNames({
			[this.props.getId('list')]: isOpen,
			[this.props.getId('backspace-remove-message')]: this.props.multi
			&& !this.props.disabled
			&& this.props.isFocused
			&& !this.props.inputValue
		});

		// TODO: Check how this project includes Object.assign()
		const inputProps = Object.assign({}, this.props.inputProps, {
			role: 'combobox',
			'aria-expanded': '' + isOpen,
			'aria-owns': ariaOwns,
			'aria-haspopup': '' + isOpen,
			'aria-activedescendant': isOpen ? this.props.getId('option', focusedOptionIndex) : this.props.getId('value'),
			'aria-describedby': this.props['aria-describedby'],
			'aria-labelledby': this.props['aria-labelledby'],
			'aria-label': this.props['aria-label'],
			className: className,
			tabIndex: this.props.tabIndex,
			onBlur: this.props.handleInputBlur,
			onChange: this.props.handleInputChange,
			onFocus: this.props.handleInputFocus,
			ref: this.props.onInputRef,
			required: this.props.required,
			value: this.props.inputValue
		});

		if (this.props.inputRenderer) {
			return this.props.inputRenderer(inputProps);
		}

		if (this.props.disabled || !this.props.searchable) {
			const {inputClassName, ...divProps} = this.props.inputProps;
			return (
				<div
					{...divProps}
					role="combobox"
					aria-expanded={isOpen}
					aria-owns={isOpen ? this.props.getId('list') : this.props.getId('value')}
					aria-activedescendant={isOpen ? this.props.getId('option', focusedOptionIndex) : this.props.getId('value')}
					className={className}
					tabIndex={this.props.tabIndex || 0}
					onBlur={this.props.handleInputBlur}
					onFocus={this.props.handleInputFocus}
					ref={this.props.onInputRef}
					aria-readonly={'' + !!this.props.disabled}
					style={{border: 0, width: 1, display: 'inline-block'}}/>
			);
		}

		if (this.props.autosize) {
			return (
				<AutosizeInput {...inputProps} minWidth="5"/>
			);
		}
		return (
			<div className={ className }>
				<input {...inputProps} />
			</div>
		);
	},

	renderClear () {
		if (!this.props.clearable || (!this.props.value || this.props.value === 0) || (this.props.multi && !this.props.value.length) || this.props.disabled || this.props.isLoading) return;
		const clear = this.props.clearRenderer();

		return (
			<span className="Select-clear-zone"
						title={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
						aria-label={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
						onMouseDown={this.props.clearValue}
						onTouchStart={this.props.handleTouchStart}
						onTouchMove={this.props.handleTouchMove}
						onTouchEnd={this.props.handleTouchEndClearValue}
			>
				{clear}
			</span>
		);
	},

	renderArrow () {
		const onMouseDown = this.props.handleMouseDownOnArrow;
		const isOpen = this.props.isOpen;
		const arrow = this.props.arrowRenderer({onMouseDown, isOpen});

		return (
			<span
				className="Select-arrow-zone"
				onMouseDown={onMouseDown}
			>
				{arrow}
			</span>
		);
	},

	renderMenu (options, valueArray, focusedOption) {
		if (options && options.length) {
			return this.props.menuRenderer({
				focusedOption,
				focusOption: this.props.focusOption,
				instancePrefix: this.props.getId(),
				labelKey: this.props.labelKey,
				onFocus: this.props.focusOption,
				onSelect: this.props.selectValue,
				optionClassName: this.props.optionClassName,
				optionComponent: this.props.optionComponent,
				optionRenderer: this.props.optionRenderer || this.props.getOptionLabel,
				options,
				selectValue: this.props.selectValue,
				valueArray,
				valueKey: this.props.valueKey,
				onOptionRef: this.props.onOptionRef,
			});
		} else if (this.props.noResultsText) {
			return (
				<div className="Select-noresults">
					{this.props.noResultsText}
				</div>
			);
		} else {
			return null;
		}
	},

	renderOuter (options, valueArray, focusedOption) {
		let menu = this.renderMenu(options, valueArray, focusedOption);
		if (!menu) {
			return null;
		}

		return (
			<div ref={this.props.onMenuContainerRef} className="Select-menu-outer"
					 style={this.props.menuContainerStyle}>
				<div ref={this.props.onMenuRef} role="listbox" className="Select-menu"
						 id={this.props.getId('list')}
						 style={this.props.menuStyle}
						 onScroll={this.props.handleMenuScroll}
						 onMouseDown={this.props.handleMouseDownOnMenu}>
					{menu}
				</div>
			</div>
		);
	},

	render () {
		let className = classNames('Select', this.props.className, {
			'Select--multi': this.props.multi,
			'Select--single': !this.props.multi,
			'is-disabled': this.props.disabled,
			'is-focused': this.props.isFocused,
			'is-loading': this.props.isLoading,
			'is-open': this.props.isOpen,
			'is-pseudo-focused': this.props.isPseudoFocused,
			'is-searchable': this.props.searchable,
			'has-value': this.props.valueArray.length,
		});

		let removeMessage = null;
		if (this.props.removeMessage) {
			removeMessage = (
				<span id={this.props.getId('backspace-remove-message')} className="Select-aria-only"
							aria-live="assertive">
					{this.props.removeMessage}
				</span>
			);
		}

		return (
			<div
				ref={this.props.onWrapperRef}
				className={className}
				style={this.props.wrapperStyle}
			>
				<div ref={this.props.onControlRef}
						 className="Select-control"
						 style={this.props.style}
						 onKeyDown={this.props.handleKeyDown}
						 onMouseDown={this.props.handleMouseDown}
						 onTouchEnd={this.props.handleTouchEnd}
						 onTouchStart={this.props.handleTouchStart}
						 onTouchMove={this.props.handleTouchMove}
				>
					<span className="Select-multi-value-wrapper" id={this.props.getId('value')}>
						{this.renderValue(this.props.valueArray, this.props.isOpen)}
						{this.renderInput(this.props.valueArray, this.props.focusedOptionIndex)}
					</span>
					{this.props.removeMessage}
					{this.renderLoading()}
					{this.renderClear()}
					{this.renderArrow()}
				</div>
				{this.props.isOpen ? this.renderOuter(this.props.options, !this.props.multi ? this.props.valueArray : null, this.props.focusedOption) : null}
			</div>
		);
	}

});

export default selectControl(Select);
