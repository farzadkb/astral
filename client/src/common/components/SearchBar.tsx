import { Fragment, FC } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'

// common
import useSearch from 'common/hooks/useSearch'
import useMediaQuery from 'common/hooks/useMediaQuery'
import { SearchType, searchTypes } from 'common/constants'
import { useDomains } from 'common/providers/ChainProvider'

interface FormValues {
  searchTerm: string
  searchType: SearchType
}

const SearchBar: FC = () => {
  const { selectedChain } = useDomains()
  const initialValues: FormValues = { searchTerm: '', searchType: searchTypes[0] }

  const handleSearch = useSearch()
  const isDesktop = useMediaQuery('(min-width: 640px)')

  const searchValidationSchema = Yup.object().shape({
    searchTerm: Yup.string().trim().required('Search term is required'),
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={searchValidationSchema}
      onSubmit={(values) => {
        handleSearch(values.searchTerm, values.searchType.id)
      }}
    >
      {({ errors, touched, values, handleSubmit, handleChange, setFieldValue }) => (
        <Form className='w-full my-8' onSubmit={handleSubmit} data-testid='testSearchForm'>
          <div className='flex w-full items-center'>
            <Listbox
              value={values.searchType}
              onChange={(val) => setFieldValue('searchType', val)}
              name='searchType'
              data-testid='search-type-list'
            >
              <div className='relative w-36'>
                <Listbox.Button className='relative w-full cursor-default rounded-full bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm dark:bg-[#1E254E] dark:text-white'>
                  <div className='flex'>
                    <span className='ml-2 block truncate'>{values['searchType'].name}</span>
                    <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                      <ChevronDownIcon
                        className='h-5 w-5 text-gray-400 ui-open:rotate-180 ui-open:transform'
                        aria-hidden='true'
                      />
                    </span>
                  </div>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute mt-1 max-h-60 w-auto md:w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20 dark:bg-[#1E254E]'>
                    {searchTypes.map((term, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-4 md:pl-10 pr-4 dark:bg-[#1E254E] dark:text-white ${
                            active ? 'bg-gray-100 text-amber-900' : 'text-gray-900'
                          }`
                        }
                        value={term}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {term.name}
                            </span>
                            {selected ? (
                              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-[#37D058]'>
                                <CheckIcon className='h-5 w-5 hidden md:block' aria-hidden='true' />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <div className='ml-4 w-full'>
              <div className='relative'>
                <input
                  data-testid='search-term-input'
                  id='searchTerm'
                  className={`
                    dark:bg-[#1E254E] dark:text-white block px-4 py-[10px] w-full text-sm text-gray-900 rounded-md bg-white shadow-lg
                    ${
                      errors.searchTerm &&
                      touched.searchTerm &&
                      'block px-4 py-[10px] w-full text-sm text-gray-900 rounded-md bg-white shadow-lg'
                    } 
                  `}
                  placeholder={
                    isDesktop
                      ? `Search for Block / Account in ${selectedChain.urls.page} ...`
                      : 'Search...'
                  }
                  name='searchTerm'
                  value={values.searchTerm}
                  onChange={handleChange}
                />
                <button
                  type='submit'
                  data-testid='testSearchSubmit'
                  className='absolute right-1 md:right-2.5 bottom-0 focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-4 py-2 '
                >
                  <ArrowLongRightIcon stroke='#DE67E4' className='w-6 h-6' />
                </button>
              </div>
            </div>
          </div>
          {errors.searchTerm && touched.searchTerm ? (
            <div className='text-red-500 text-md mt-2' data-testid='errorMessage'>
              {errors.searchTerm}
            </div>
          ) : null}
        </Form>
      )}
    </Formik>
  )
}

export default SearchBar
