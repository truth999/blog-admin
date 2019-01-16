import { Divider, notification, Popconfirm, Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { RadioChangeEvent } from 'antd/lib/radio';
import Column from 'antd/lib/table/Column';
import ApolloClient from 'apollo-client';
import dayjs from 'dayjs';
import React from 'react';
import { Query } from 'react-apollo';

import { MutationComponent } from '@/components/Mutation';
import { RadioSelect, TypeList } from '@/components/RadioSelect';

import { ExandedRowRender } from './ExpandedRowRender';
import { HerosItem, HerosState, Response } from './heros.interface';
import { UPDATE_HERO } from './mutation';
import { GET_HEROS } from './query';
import { HerosMutations } from './HerosMutations';

export default class Heros extends React.Component<{}, HerosState> {
  state = {
    offset: 0,
    limit: 10,
    keyword: '',
    state: 'TODO' as 'TODO'
  };

  pageChange = (page: number) => {
    this.setState({
      offset: Number(`${(page - 1) * 10}`)
    });
  };

  search = (keyword: string) => {
    this.setState({
      keyword
    });
  };

  handleError = (message: string) => {
    notification.error({
      message: 'GraphQL error',
      description: message,
      duration: 5
    });
  };

  onChange = (e: RadioChangeEvent, typeName: string) => {
    console.log(e.target.value, typeName);
    this.setState({
      [typeName]: e.target.value
    });
  };

  updateHeros = async (
    client: ApolloClient<any>,
    record: HerosItem,
    state: string
  ) => {
    const result = await client.mutate({
      mutation: UPDATE_HERO,
      variables: {
        _id: record._id,
        state
      }
    });
    console.log(result);
  };

  render() {
    const { offset, limit, keyword, state } = this.state;

    const typeList: TypeList[] = [
      {
        name: '状态',
        typeName: 'state',
        list: [
          { name: '待审核', id: 'TODO' },
          { name: '审核通过', id: 'SUCCESS' },
          { name: '审核不通过', id: 'FAIL' }
        ],
        defaultValue: 'TODO'
      }
    ];

    return (
      <div>
        <RadioSelect
          typeList={typeList}
          onSearch={this.search}
          onChange={this.onChange}
        />

        <div className="content">
          <Query<Response>
            query={GET_HEROS}
            variables={{ offset, limit, keyword, state }}
            notifyOnNetworkStatusChange
          >
            {({ data, loading, error, networkStatus, refetch, client }) => {
              error && this.handleError(error.message);

              const result = (data && data.getHeros) || { docs: [], total: 0 };

              const pagination: PaginationProps = {
                total: result.total,
                pageSize: limit,
                onChange: this.pageChange,
                showTotal: total => `共 ${total} 条`
              };

              return (
                <>
                  <Table<HerosItem>
                    dataSource={result.docs}
                    loading={loading || networkStatus === 4}
                    rowKey="_id"
                    pagination={pagination}
                    expandedRowRender={ExandedRowRender}
                  >
                    <Column
                      key="name"
                      title="Name"
                      dataIndex="name"
                      width="400px"
                    />
                    <Column
                      key="create_at"
                      title="Create_at"
                      dataIndex="create_at"
                      render={text => dayjs(text).format('YYYY-MM-DD hh:mm:ss')}
                    />
                    <Column
                      key="state"
                      title="State"
                      dataIndex="state"
                      width="300px"
                    />

                    <Column
                      title="Action"
                      key="action"
                      width="300px"
                      render={(text, record: HerosItem) => {
                        return (
                          <>
                            {record.state !== 'SUCCESS' && (
                              <HerosMutations
                                mutation={UPDATE_HERO}
                                refetch={refetch}
                                ItemName={/^HerosItem/}
                                variables={{
                                  _id: record._id,
                                  state: 'SUCCESS'
                                }}
                                text="通过"
                              />
                            )}
                            {record.state === 'TODO' && (
                              <Divider type="vertical" />
                            )}

                            {record.state !== 'FAIL' && (
                              <HerosMutations
                                mutation={UPDATE_HERO}
                                refetch={refetch}
                                ItemName={/^HerosItem/}
                                variables={{
                                  _id: record._id,
                                  state: 'FAIL'
                                }}
                                text="不通过"
                              />
                            )}
                            <Divider type="vertical" />
                          </>
                        );
                      }}
                    />
                  </Table>
                </>
              );
            }}
          </Query>
        </div>
      </div>
    );
  }
}
