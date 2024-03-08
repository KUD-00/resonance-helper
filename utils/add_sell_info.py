file_path = 'goods.ts'
backup_file_path = 'goods_backup.ts'

append_str = '      {\n        good_id: "",\n        station_id: "83000001"\n      },\n'

with open(file_path, 'r', encoding='utf-8') as file:
    lines = file.readlines()

inside_sell_correspond = False
for i, line in enumerate(lines):
    if 'sell_correspond' in line:
        inside_sell_correspond = True
    elif inside_sell_correspond and line.strip() == ']':
        if '}' in lines[i-1]:
            lines[i-1] = lines[i-1].rstrip() + '\n'
        lines.insert(i, append_str)
        inside_sell_correspond = False

with open(file_path, 'w', encoding='utf-8') as file:
    file.writelines(lines)
