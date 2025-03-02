import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useErrorHandler } from 'react-error-boundary'

// layout
import { NotFound } from 'layout/components'

// common
import { Spinner } from 'common/components'
import useMediaQuery from 'common/hooks/useMediaQuery'

// operator
import { QUERY_OPERATOR_BY_ID } from 'Operator/query'
import OperatorDetailsCard from 'Operator/components/OperatorDetailsCard'
import OperatorNominatorList from 'Operator/components/OperatorNominatorList'

const Operator: FC = () => {
  const { operatorId } = useParams<{ operatorId?: string }>()

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { data, error, loading } = useQuery(QUERY_OPERATOR_BY_ID, {
    variables: { operatorId: operatorId },
  })

  useErrorHandler(error)

  if (loading) {
    return <Spinner />
  }

  if (!data.operatorById) {
    return <NotFound />
  }

  const operator = data.operatorById

  return (
    <div className='w-full flex flex-col space-y-4'>
      <OperatorDetailsCard operator={operator} isDesktop={isDesktop} />
      <OperatorNominatorList operator={operator} isDesktop={isDesktop} />
    </div>
  )
}

export default Operator
