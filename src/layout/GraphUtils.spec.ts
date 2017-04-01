import {test} from 'ava';
import {GraphUtils} from 'stepping';

test('should convert domain DSL to node format', t => {
  let dslExample = {
    'name': ' 库存子域',
    'type': 'domain',
    'aggregates': [{
      'name': ' 库存',
      'type': 'aggregate',
      'events': [
        {'name': ' 库存已增加', 'type': 'event'},
        {'name': ' 库存已恢复', 'type': 'event'},
        {'name': ' 库存已扣减', 'type': 'event'},
        {'name': ' 库存已锁定', 'type': 'event'}
      ],
      'commands': [
        {'name': ' 编辑库存', 'type': 'command'}
      ]
    }]
  };
  let result = GraphUtils.dslToNodes(dslExample, 'domain');
  t.deepEqual(JSON.stringify(result), '[{\"nodes\":[{\"id\":0,\"name\":\" 库存子域\"},{\"id\":1,\"name\":\" 库存\"}],\"edges\":[[{\"id\":0,\"name\":\" 库存子域\"},{\"id\":1,\"name\":\" 库存\"}]]}]')
});

test('should convert aggregate DSL to node format', t => {
  let dslExample = {
    'name': ' 库存',
    'type': 'aggregate',
    'events': [
      {'name': ' 库存已增加', 'type': 'event'},
      {'name': ' 库存已恢复', 'type': 'event'},
      {'name': ' 库存已扣减', 'type': 'event'},
      {'name': ' 库存已锁定', 'type': 'event'}
    ],
    'commands': [
      {'name': ' 编辑库存', 'type': 'command'}
    ]
  };
  let result = GraphUtils.dslToNodes(dslExample, 'aggregate');
  t.deepEqual(JSON.stringify(result), '[{\"nodes\":[{\"id\":0,\"name\":\" 库存\"},{\"id\":1,\"name\":\" 库存已增加\"},{\"id\":2,\"name\":\" 库存已恢复\"},{\"id\":3,\"name\":\" 库存已扣减\"},{\"id\":4,\"name\":\" 库存已锁定\"},{\"id\":1,\"name\":\" 编辑库存\"}],\"edges\":[[{\"id\":0,\"name\":\" 库存\"},{\"id\":1,\"name\":\" 库存已增加\"}],[{\"id\":0,\"name\":\" 库存\"},{\"id\":2,\"name\":\" 库存已恢复\"}],[{\"id\":0,\"name\":\" 库存\"},{\"id\":3,\"name\":\" 库存已扣减\"}],[{\"id\":0,\"name\":\" 库存\"},{\"id\":4,\"name\":\" 库存已锁定\"}],[{\"id\":0,\"name\":\" 库存\"},{\"id\":1,\"name\":\" 编辑库存\"}]]}]')
});