/*!
 Copyright (c) 2016 Jed Watson.
 Licensed under the MIT License (MIT), see
 http://jedwatson.github.io/react-select
 */

import React from 'react';
import ReactDOM from 'react-dom';
import AutosizeInput from 'react-input-autosize';
import classNames from 'classnames';

import defaultArrowRenderer from './utils/defaultArrowRenderer';
import defaultFilterOptions from './utils/defaultFilterOptions';
import defaultMenuRenderer from './utils/defaultMenuRenderer';
import defaultClearRenderer from './utils/defaultClearRenderer';

import SelectBase from './SelectBase';
import Async from './Async';
import AsyncCreatable from './AsyncCreatable';
import Creatable from './Creatable';
import Option from './Option';
import Value from './Value';


export default SelectBase;

/*
	renderLoading () {
		if (!this.props.isLoading) return;
		return (
			<span className="Select-loading-zone" aria-hidden="true">
				<span className="Select-loading" />
			</span>
		);
	},

	renderValue (valueArray, isOpen) {
		let renderLabel = this.props.valueRenderer || this.getOptionLabel;
		let ValueComponent = this.props.valueComponent;
		if (!valueArray.length) {
			return !this.state.inputValue ? <div className="Select-placeholder">{this.props.placeholder}</div> : null;
		}
		let onClick = this.props.onValueClick ? this.handleValueClick : null;
		if (this.props.multi) {
			return valueArray.map((value, i) => {
				return (
					<ValueComponent
						id={this._instancePrefix + '-value-' + i}
						instancePrefix={this._instancePrefix}
						disabled={this.props.disabled || value.clearableValue === false}
						key={`value-${i}-${value[this.props.valueKey]}`}
						onClick={onClick}
						onRemove={this.removeValue}
						value={value}
					>
						{renderLabel(value, i)}
						<span className="Select-aria-only">&nbsp;</span>
					</ValueComponent>
				);
			});
		} else if (!this.state.inputValue) {
			if (isOpen) onClick = null;
			return (
				<ValueComponent
					id={this._instancePrefix + '-value-item'}
					disabled={this.props.disabled}
					instancePrefix={this._instancePrefix}
					onClick={onClick}
					value={valueArray[0]}
				>
					{renderLabel(valueArray[0])}
				</ValueComponent>
			);
		}
	},

	renderInput (valueArray, focusedOptionIndex) {
		var className = classNames('Select-input', this.props.inputProps.className);
		const isOpen = !!this.state.isOpen;

		const ariaOwns = classNames({
			[this._instancePrefix + '-list']: isOpen,
			[this._instancePrefix + '-backspace-remove-message']: this.props.multi
			&& !this.props.disabled
			&& this.state.isFocused
			&& !this.state.inputValue
		});

		// TODO: Check how this project includes Object.assign()
		const inputProps = Object.assign({}, this.props.inputProps, {
			role: 'combobox',
			'aria-expanded': '' + isOpen,
			'aria-owns': ariaOwns,
			'aria-haspopup': '' + isOpen,
			'aria-activedescendant': isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value',
			'aria-describedby': this.props['aria-describedby'],
			'aria-labelledby': this.props['aria-labelledby'],
			'aria-label': this.props['aria-label'],
			className: className,
			tabIndex: this.props.tabIndex,
			onBlur: this.handleInputBlur,
			onChange: this.handleInputChange,
			onFocus: this.handleInputFocus,
			ref: ref => this.input = ref,
			required: this.state.required,
			value: this.state.inputValue
		});

		if (this.props.inputRenderer) {
			return this.props.inputRenderer(inputProps);
		}

		if (this.props.disabled || !this.props.searchable) {
			const { inputClassName, ...divProps } = this.props.inputProps;
			return (
				<div
					{...divProps}
					role="combobox"
					aria-expanded={isOpen}
					aria-owns={isOpen ? this._instancePrefix + '-list' : this._instancePrefix + '-value'}
					aria-activedescendant={isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value'}
					className={className}
					tabIndex={this.props.tabIndex || 0}
					onBlur={this.handleInputBlur}
					onFocus={this.handleInputFocus}
					ref={ref => this.input = ref}
					aria-readonly={'' + !!this.props.disabled}
					style={{ border: 0, width: 1, display:'inline-block' }}/>
			);
		}

		if (this.props.autosize) {
			return (
				<AutosizeInput {...inputProps} minWidth="5" />
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
			<span className="Select-clear-zone" title={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
						aria-label={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
						onMouseDown={this.clearValue}
						onTouchStart={this.handleTouchStart}
						onTouchMove={this.handleTouchMove}
						onTouchEnd={this.handleTouchEndClearValue}
			>
				{clear}
			</span>
		);
	},

	renderArrow () {
		const onMouseDown = this.handleMouseDownOnArrow;
		const isOpen = this.state.isOpen;
		const arrow = this.props.arrowRenderer({ onMouseDown, isOpen });

		return (
			<span
				className="Select-arrow-zone"
				onMouseDown={onMouseDown}
			>
				{arrow}
			</span>
		);
	},

	filterOptions (excludeOptions) {
		var filterValue = this.state.inputValue;
		var options = this.props.options || [];
		if (this.props.filterOptions) {
			// Maintain backwards compatibility with boolean attribute
			const filterOptions = typeof this.props.filterOptions === 'function'
				? this.props.filterOptions
				: defaultFilterOptions;

			return filterOptions(
				options,
				filterValue,
				excludeOptions,
				{
					filterOption: this.props.filterOption,
					ignoreAccents: this.props.ignoreAccents,
					ignoreCase: this.props.ignoreCase,
					labelKey: this.props.labelKey,
					matchPos: this.props.matchPos,
					matchProp: this.props.matchProp,
					valueKey: this.props.valueKey,
				}
			);
		} else {
			return options;
		}
	},

	onOptionRef(ref, isFocused) {
		if (isFocused) {
			this.focused = ref;
		}
	},

	renderMenu (options, valueArray, focusedOption) {
		if (options && options.length) {
			return this.props.menuRenderer({
				focusedOption,
				focusOption: this.focusOption,
				instancePrefix: this._instancePrefix,
				labelKey: this.props.labelKey,
				onFocus: this.focusOption,
				onSelect: this.selectValue,
				optionClassName: this.props.optionClassName,
				optionComponent: this.props.optionComponent,
				optionRenderer: this.props.optionRenderer || this.getOptionLabel,
				options,
				selectValue: this.selectValue,
				valueArray,
				valueKey: this.props.valueKey,
				onOptionRef: this.onOptionRef,
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

	renderHiddenField (valueArray) {
		if (!this.props.name) return;
		if (this.props.joinValues) {
			let value = valueArray.map(i => stringifyValue(i[this.props.valueKey])).join(this.props.delimiter);
			return (
				<input
					type="hidden"
					ref={ref => this.value = ref}
					name={this.props.name}
					value={value}
					disabled={this.props.disabled} />
			);
		}
		return valueArray.map((item, index) => (
			<input key={'hidden.' + index}
						 type="hidden"
						 ref={'value' + index}
						 name={this.props.name}
						 value={stringifyValue(item[this.props.valueKey])}
						 disabled={this.props.disabled} />
		));
	},

	getFocusableOptionIndex (selectedOption) {
		var options = this._visibleOptions;
		if (!options.length) return null;

		let focusedOption = this.state.focusedOption || selectedOption;
		if (focusedOption && !focusedOption.disabled) {
			let focusedOptionIndex = -1;
			options.some((option, index) => {
				const isOptionEqual = option.value === focusedOption.value;
				if (isOptionEqual) {
					focusedOptionIndex = index;
				}
				return isOptionEqual;
			});
			if (focusedOptionIndex !== -1) {
				return focusedOptionIndex;
			}
		}

		for (var i = 0; i < options.length; i++) {
			if (!options[i].disabled) return i;
		}
		return null;
	},

	renderOuter (options, valueArray, focusedOption) {
		let menu = this.renderMenu(options, valueArray, focusedOption);
		if (!menu) {
			return null;
		}

		return (
			<div ref={ref => this.menuContainer = ref} className="Select-menu-outer" style={this.props.menuContainerStyle}>
				<div ref={ref => this.menu = ref} role="listbox" className="Select-menu" id={this._instancePrefix + '-list'}
						 style={this.props.menuStyle}
						 onScroll={this.handleMenuScroll}
						 onMouseDown={this.handleMouseDownOnMenu}>
					{menu}
				</div>
			</div>
		);
	},

	render () {
		let valueArray = this.getValueArray(this.props.value);
		let options = this._visibleOptions = this.filterOptions(this.props.multi ? this.getValueArray(this.props.value) : null);
		let isOpen = this.state.isOpen;
		if (this.props.multi && !options.length && valueArray.length && !this.state.inputValue) isOpen = false;
		const focusedOptionIndex = this.getFocusableOptionIndex(valueArray[0]);

		let focusedOption = null;
		if (focusedOptionIndex !== null) {
			focusedOption = this._focusedOption = options[focusedOptionIndex];
		} else {
			focusedOption = this._focusedOption = null;
		}
		let className = classNames('Select', this.props.className, {
			'Select--multi': this.props.multi,
			'Select--single': !this.props.multi,
			'is-disabled': this.props.disabled,
			'is-focused': this.state.isFocused,
			'is-loading': this.props.isLoading,
			'is-open': isOpen,
			'is-pseudo-focused': this.state.isPseudoFocused,
			'is-searchable': this.props.searchable,
			'has-value': valueArray.length,
		});

		let removeMessage = null;
		if (this.props.multi &&
			!this.props.disabled &&
			valueArray.length &&
			!this.state.inputValue &&
			this.state.isFocused &&
			this.props.backspaceRemoves) {
			removeMessage = (
				<span id={this._instancePrefix + '-backspace-remove-message'} className="Select-aria-only" aria-live="assertive">
					{this.props.backspaceToRemoveMessage.replace('{label}', valueArray[valueArray.length - 1][this.props.labelKey])}
				</span>
			);
		}

		return (
			<div ref={ref => this.wrapper = ref}
					 className={className}
					 style={this.props.wrapperStyle}>
				{this.renderHiddenField(valueArray)}
				<div ref={ref => this.control = ref}
						 className="Select-control"
						 style={this.props.style}
						 onKeyDown={this.handleKeyDown}
						 onMouseDown={this.handleMouseDown}
						 onTouchEnd={this.handleTouchEnd}
						 onTouchStart={this.handleTouchStart}
						 onTouchMove={this.handleTouchMove}
				>
					<span className="Select-multi-value-wrapper" id={this._instancePrefix + '-value'}>
						{this.renderValue(valueArray, isOpen)}
						{this.renderInput(valueArray, focusedOptionIndex)}
					</span>
					{removeMessage}
					{this.renderLoading()}
					{this.renderClear()}
					{this.renderArrow()}
				</div>
				{isOpen ? this.renderOuter(options, !this.props.multi ? valueArray : null, focusedOption) : null}
			</div>
		);
	}

});

export default Select;
*/
