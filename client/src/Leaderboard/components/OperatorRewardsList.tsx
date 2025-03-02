import React, { useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { useQuery } from '@apollo/client'

// common
import { Pagination, Spinner } from 'common/components'
import ExportButton from 'common/components/ExportButton'
import { PAGE_SIZE } from 'common/constants'
import NotAllowed from 'common/components/NotAllowed'
import useDomains from 'common/hooks/useDomains'

// leaderboard
import { QUERY_OPERATORS_REWARDS_LIST } from 'Leaderboard/querys'
import OperatorRewardsListTable from './OperatorRewardsListTable'

const OperatorRewardsList = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [lastCursor, setLastCursor] = useState<string | undefined>(undefined)
  const { selectedChain } = useDomains()

  const { data, error, loading } = useQuery(QUERY_OPERATORS_REWARDS_LIST, {
    variables: { first: PAGE_SIZE, after: lastCursor },
    pollInterval: 6000,
  })

  useErrorHandler(error)

  if (loading) {
    return <Spinner />
  }

  if (selectedChain.title !== 'Gemini 3g' || selectedChain.isDomain) {
    return <NotAllowed />
  }

  const operatorRewardsConnection = data.operatorRewardsConnection.edges.map(
    (accountRewards) => accountRewards.node,
  )
  const totalCount = data.operatorRewardsConnection.totalCount

  const pageInfo = data.operatorRewardsConnection.pageInfo

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
    setLastCursor(pageInfo.endCursor)
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1)
    setLastCursor(pageInfo.endCursor)
  }

  const onChange = (page: number) => {
    setCurrentPage(Number(page))

    const newCount = page > 0 ? PAGE_SIZE * Number(page + 1) : PAGE_SIZE
    const endCursor = newCount - PAGE_SIZE

    if (endCursor === 0 || endCursor < 0) {
      return setLastCursor(undefined)
    }
    setLastCursor(endCursor.toString())
  }

  return (
    <div className='w-full flex flex-col align-middle'>
      <div className='w-full flex flex-col sm:mt-0'>
        <OperatorRewardsListTable operators={operatorRewardsConnection} page={currentPage} />
        <div className='w-full flex justify-between gap-2'>
          <ExportButton data={operatorRewardsConnection} filename='account-list' />
          <Pagination
            nextPage={handleNextPage}
            previousPage={handlePreviousPage}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
            hasNextPage={pageInfo.hasNextPage}
            hasPreviousPage={pageInfo.hasPreviousPage}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}
export default OperatorRewardsList
